import express from 'express';
const router = express.Router();
import { trashCans, createTrashCan, updateTrashCan, uploadImage } from '../controller/trashCan.js';
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', trashCans);
// router.get('/image/:id', getImage);
router.post('/', createTrashCan);
router.post('/images', upload.single('image'), uploadImage);
router.put('/:id', updateTrashCan);


export default router;
