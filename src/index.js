import { authService } from './services/auth-service.js';
import dotenv from 'dotenv';

dotenv.config(".env");
authService(3000, process.env.SECRET);