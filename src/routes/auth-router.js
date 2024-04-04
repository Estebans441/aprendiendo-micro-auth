import { Router } from 'express';
import { AuthController } from '../controllers/auth-controller.js';

export const authRouter = (secret) => {
    const router = Router();
    const authController = new AuthController(secret);
    
    router.post('/login', authController.login);

    router.get('/validate', authController.verifyToken);

    router.get('/refresh', authController.refresh);

    return router;
}