import express from 'express';
const router = express.Router();
import { getDevices, refreshDevice } from '../controller/device.js';

router.get('/', getDevices);
router.delete('/', refreshDevice);


export default router;