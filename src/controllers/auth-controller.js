import jwt from 'jsonwebtoken';
import { validatePartialUser, validateUser } from '../models/schemas/user-schema.js';
import crypto from 'crypto';

export class AuthController {
    constructor(secret){
        this.secret = secret;
        this.users = [];
    }

    // login method
    login = async (req, res) => {
        try {
            const result = validatePartialUser(req.body);
            if (result.error) {
                return res.status(400).json({ message: result.error });
            }
            let { email, password } = result.data;
            password = createHash(password);
            // const user = this.users.find((user) => user.email === email && user.password === password);
            const user = { id: '1', email: 'email.com', password: 'password'}
            if (!user) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            const token = jwt.sign({ id: user.id, username: user.email }, this.secret);
            return res.status(200).json({ token });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // Middleware for token verification
    verifyToken = async(req, res, next) => {
        const header = req.header('Authorization') || '';
        const token = header.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Token not provided" });
        }
        try {
            const payload = jwt.verify(token, this.secret);
            req.user = payload;
            next();
        } catch (error) {
            return res.status(401).json({ message: "Invalid token" });
        }
    }

    // refresh method
    refresh = async (req, res) => {
        try {
            const header = req.header('Authorization') || '';
            const token = header.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: "Token not provided" });
            }
            const payload = jwt.verify(token, this.secret);
            const newToken = jwt.sign({ id: payload.id, username: payload.username }, this.secret);
            return res.status(200).json({ token: newToken });
        } catch (error) {
            return res.status(401).json({ message: "Invalid token" });
        }
    }
}

function createHash(password) {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
}