import {sendError} from "../helpers/response-handler.js";

export default async (req, res, next) => {
    if (!req.file) {
        sendError(res, 422, 'ValidationError', 'File is required');
        return;
    }

    next();
}