import express, { json } from 'express';
import { authRouter } from '../routes/auth-router.js';
import { userRouter } from '../routes/user-router.js';

export const authService = (PORT, secret) =>{
    const app = express();
    app.disable('x-powered-by');

    // Middlewares
    app.use(json());

    // Router
    app.use('/auth', authRouter(secret));
    app.use('/users', userRouter(secret));

    // Listen on port PORT
    app.listen(PORT, () => {
        console.log(`Server listening on port http://localhost:${PORT}`);
    });
}
