import jwt from 'jsonwebtoken';
import { validatePartialUser, validateUser } from '../models/schemas/user-schema.js';
import crypto from 'crypto';

export class AuthController {
    constructor(secret){
        this.secret = secret;
        this.users = [];
    }

    // register method
    register = async (req, res) => {
        try {
            const result = validateUser(req.body);
            if (result.error) {
                return res.status(400).json({ message: result.error });
            }
            const newUser = {
                id: crypto.randomUUID(),
                ...result.data,
                password: createHash(result.data.password)
            };
            this.users.push(newUser);
            return res.status(200).json({ message: "User registered successfully" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }
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
            const user = this.users.find((user) => user.email === email && user.password === password);
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

    // public route (no need token to access)
    public = async (req, res) => {
        res.send("I'm public!");
    }

    // private route (need token to access)
    private = async (req, res) => {
        res.status(200).json({message: 'Private'});
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
}

function createHash(password) {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
}