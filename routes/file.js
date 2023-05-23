import { Router } from "express";
import fileController from "../controllers/file.controller.js";
import upload from "../multer/upload.js";
import validate from "../validators/index.js";
import getFilesValidator from "../validators/file/get-files.validator.js";
import getFileByIdValidator from "../validators/file/get-file-by-id.validator.js";
import FileExistsMiddleware from "../middleware/file-exists.middleware.js";

const router = Router();

router.post('/upload', upload.single('file'), FileExistsMiddleware, fileController.upload);

router.get('/list', validate(getFilesValidator), fileController.get);

router.get('/:id', validate(getFileByIdValidator), fileController.getById);

router.get('/download/:id', validate(getFileByIdValidator), fileController.download);

router.put('/update/:id', validate(getFileByIdValidator), upload.single('file'), FileExistsMiddleware, fileController.update);

router.delete('/delete/:id', validate(getFileByIdValidator), fileController.delete);

export default router;