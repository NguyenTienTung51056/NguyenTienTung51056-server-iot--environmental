import express from 'express';
import { deleteDevice } from '../controller/device.js';
const router = express.Router();


router.delete('/:id', deleteDevice);



export default router;
