import express from 'express';
const router = express.Router();
import { login, loginAdmin, register, users, updateUser } from '../controller/user.js';
import { verifyToken } from '../utils/middleware.js';

router.get('/', verifyToken, users);
router.post('/', verifyToken, updateUser);
router.post('/register', register);
router.post('/login', login);
router.post('/login-admin', loginAdmin);

export default router;

