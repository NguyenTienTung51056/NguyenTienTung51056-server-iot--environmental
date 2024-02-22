import express from 'express';
const router = express.Router();
import { uploadImage } from '../controller/image.js';
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });


router.post('/', upload.single('image'), uploadImage);

export default router;