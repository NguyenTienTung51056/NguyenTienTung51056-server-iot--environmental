import express from 'express';
const router = express.Router();
import { locations } from '../controller/location.js';

router.get('', locations);



export default router;
