import express from 'express';
const router = express.Router();
import { trashCans, createTrashCan, updateTrashCan, deleteTrashCan } from '../controller/trashCan.js';
import multer from 'multer';
const upload = multer();



router.get('/', trashCans);

router.post('/', upload.fields([
    { name: 'image_area', maxCount: 1 },
    { name: 'image_thumbnail', maxCount: 1 },
    { name: 'trash_child_images', maxCount: 10 },
]), createTrashCan);

router.put('/:id', upload.fields([
    { name: 'image_area', maxCount: 1 },
    { name: 'image_thumbnail', maxCount: 1 },
    { name: 'trash_child_images', maxCount: 10 },
]), updateTrashCan);

router.delete('/:id', deleteTrashCan);

export default router;
