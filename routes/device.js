import express from 'express';
import { deleteDevice, addDevice } from '../controller/device.js';
import { verifyToken } from '../utils/middleware.js';
const router = express.Router();

router.post('/', verifyToken, addDevice);
router.delete('/:id', verifyToken, deleteDevice);



export default router;
