import multer from "multer";
import { v4 } from "uuid";
import { parse } from "path";
import * as fs from "fs";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync('storage/files')) {
            fs.mkdir('storage/files', { recursive: true }, (error) => {
                if (error) {
                    console.log('Error creating destination directory:', error);
                } else {
                    cb(null, 'storage/files');
                }
            });
        } else {
            cb(null, 'storage/files');
        }
    },
    filename: (req, file, cb) => {
        const { name, ext } = parse(file.originalname);

        cb(null, `${name}-${v4()}${ext}`);
    },
});

export default multer({ storage });