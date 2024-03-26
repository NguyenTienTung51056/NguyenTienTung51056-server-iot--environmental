import express from 'express';
const router = express.Router();
import { trashCans, createTrashCan, updateTrashCan, deleteTrashCan } from '../controller/trashCan.js';
import multer from 'multer';
import { verifyToken } from '../utils/middleware.js';
const upload = multer();



router.get('/', trashCans);

router.post('/', verifyToken, upload.fields([
    { name: 'image_area', maxCount: 1 },
    { name: 'image_thumbnail', maxCount: 1 },
    { name: 'trash_child_images', maxCount: 10 },
]), createTrashCan);

router.put('/:id', verifyToken, upload.fields([
    { name: 'image_area', maxCount: 1 },
    { name: 'image_thumbnail', maxCount: 1 },
    { name: 'trash_child_images', maxCount: 10 },
]), updateTrashCan);

router.delete('/:id', verifyToken, deleteTrashCan);

export default router;
