import express, { json } from 'express';
import { authRouter } from '../routes/auth-router.js';

export const authService = (PORT) =>{
    const app = express();
    app.disable('x-powered-by');

    // Middlewares
    app.use(json());

    // Router
    app.use('/api/auth', authRouter());

    // Listen on port PORT
    app.listen(PORT, () => {
        console.log(`Server listening on port http://localhost:${PORT}`);
    });
}
