import multer from 'multer';
import path from 'path';
import * as fs from "fs";

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
});

export const middleware = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Add logging middleware
import { RequestHandler } from 'express-serve-static-core';

export const logRequest: RequestHandler = (req , res, next) => {
    console.log('Incoming request to /createpost');
    console.log('Files:', req.files);
    console.log('File:', req.file);
    console.log('Body:', req.body);
    next();
};
