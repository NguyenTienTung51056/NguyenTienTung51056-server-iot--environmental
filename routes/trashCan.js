import express from 'express';
const router = express.Router();
import { trashCans, createTrashCan, updateTrashCan } from '../controller/trashCan.js';

router.get('/', trashCans);
router.post('/', createTrashCan);
router.put('/:id', updateTrashCan);


export default router;
