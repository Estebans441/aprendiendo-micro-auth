import { Router } from 'express';
import { UserController } from '../controllers/user-controller.js';
import { AuthController } from '../controllers/auth-controller.js';

export const userRouter = (secret) => {
    const router = Router();
    const userController = new UserController();
    const authController = new AuthController(secret);

    router.post('/register', userController.register);

    router.get('/:id', authController.verifyToken, userController.get);

    router.put('/:id', authController.verifyToken, userController.update);

    router.delete('/:id', authController.verifyToken, userController.delete);

    return router;
}