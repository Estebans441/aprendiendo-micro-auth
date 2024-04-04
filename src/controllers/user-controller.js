import { validatePartialUser, validateUser } from '../models/schemas/user-schema.js';
import crypto from 'crypto';

export class UserController {
    constructor(){
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
            return res.status(200).json({ message: "User registered successfully", user: newUser });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // get method
    get = async (req, res) => {
        try {
            const { id } = req.params;
            const user = this.users.find((user) => user.id === id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json(user);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // update method
    update = async (req, res) => {
        try {
            const { id } = req.params;
            const result = validatePartialUser(req.body);
            if (result.error) {
                return res.status(400).json({ message: result.error });
            }
            const user = this.users.find((user) => user.id === id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            Object.assign(user, result.data);
            return res.status(200).json({ message: "User updated successfully" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // delete method
    delete = async (req, res) => {
        try {
            const { id } = req.params;
            const index = this.users.findIndex((user) => user.id === id);
            if (index === -1) {
                return res.status(404).json({ message: "User not found" });
            }
            this.users.splice(index, 1);
            return res.status(200).json({ message: "User deleted successfully" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}

function createHash(password) {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
}