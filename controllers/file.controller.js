import { parse } from "path";
import { unlinkSync } from "fs";
import { sendError, sendSuccess } from "../helpers/response-handler.js";
import FileModel from "../models/file.model.js";
import { getFileUrl } from "../helpers/file-helper.js";

const fileController = {};

fileController.upload = async (req, res) => {
    const { base, ext } = parse(req.file.filename);

    const fileObj = {
        name: req.file.originalname,
        extension: ext,
        mimeType: req.file.mimetype,
        size: req.file.size,
        slug: base,
    }

    try {
        let file = await FileModel.create(fileObj);
        file = file.toJSON();

        sendSuccess(res, 201, file);
    } catch (error) {
        unlinkSync(req.file.path);

        sendError(res, 500, error.name, error.errors && error.errors.length ? error.errors[0].message : "File was not created");
    }
}

fileController.get = async (req, res) => {
    try {
        const list_size = req.query.list_size ? parseInt(req.query.list_size) : 10;
        const page = req.query.page ? parseInt(req.query.page) : 1;

        const files = await FileModel.findAll({
            limit: list_size,
            offset: (page - 1) * list_size,
        });

        sendSuccess(res, 200, files);
    } catch (error) {
        sendError(res, 500, error.name, error.message);
    }
}

fileController.getById = async (req, res) => {
    try {
        const id = req.params.id;
        const file = await FileModel.findByPk(id);

        if (file) {
            sendSuccess(res, 200, file);
        } else {
            sendError(res, 404, "NotFoundException","File was not found");
        }
    } catch (error) {
        sendError(res, 500, error.name, error.message);
    }
}

fileController.download = async (req, res) => {
    try {
        const id = req.params.id;
        const file = await FileModel.findByPk(id);

        if (!file) {
            sendError(res, 404, "NotFoundException","File was not found");
            return;
        }

        const fileUrl = getFileUrl(file.slug);

        res.status(200).download(fileUrl);
    } catch (error) {
        sendError(res, 500, error.name, error.message);
    }
}

fileController.update = async (req, res) => {
    try {
        const id = req.params.id;
        const newFile = req.file;
        const oldFile = await FileModel.findByPk(id);
        const oldSlug = oldFile.slug;

        if (!oldFile) {
            unlinkSync(newFile.path);
            sendError(res, 404, "NotFoundException","File was not found");
            return;
        }

        const { base, ext } = parse(newFile.filename);

        const fileObj = {
            name: newFile.originalname,
            extension: ext,
            mimeType: newFile.mimetype,
            size: newFile.size,
            slug: base,
        }

        const updatedFile = await oldFile.update(fileObj);

        if (!updatedFile) {
            unlinkSync(newFile.path);
            sendError(res, 400, "NotUpdatedException","File was not updated");
        } else {
            unlinkSync(getFileUrl(oldSlug));
            sendSuccess(res, 200, updatedFile);
        }
    } catch (error) {
        unlinkSync(req.file.path);

        sendError(res, 500, error.name, error.message);
    }
}

fileController.delete = async (req, res) => {
    try {
        const id = req.params.id;
        const file = await FileModel.findByPk(id);

        if (!file) {
            sendError(res, 404, "NotFoundException","File was not found");
            return;
        }

        await file.destroy();
        unlinkSync(getFileUrl(file.slug));

        sendSuccess(res, 200, id);
    } catch (error) {
        sendError(res, 500, error.name, error.message);
    }
}

export default fileController;