import { Router } from 'express';
import { AuthController } from '../controllers/auth-controller.js';

export const authRouter = (secret) => {
    const router = Router();
    const authController = new AuthController(secret);
    
    router.post('/register', authController.register);

    router.post('/login', authController.login);

    router.get('/public', authController.public);

    router.get('/private', authController.verifyToken, authController.private);

    return router;
}