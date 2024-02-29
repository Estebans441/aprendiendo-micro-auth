import jwt from 'jsonwebtoken';

export class AuthController {
    constructor(secret){
        this.secret = secret;
    }

    register = async (req, res) => {
        res.status(200).json({message: 'Register'});
    }

    token = async (req, res) => {
        // validacion con base de datos recibiendo el usuario y contraseña
        const { id: sub, name } = { id: 1, name: 'user' };
        const token = jwt.sign({
            sub,
            name,
            exp: Date.now() + 60 * 1000 
        }, this.secret);

        res.send({ token });
    }

    public = async (req, res) => {
        res.send("I'm public!")
    }

    private = async (req, res) => {
        try {
            // Verificar el token que viene de la forma: Bearer <token>
            const token = req.headers.authorization.split(' ')[1];
            const payload = jwt.verify(token, this.secret);

            // Verificar que el token no esté expirado
            if(payload.exp <= Date.now())
                return res.status(401).send({message: 'Token expired'});

            // Si todo está bien, se envía la respuesta
            res.send("I'm private!")
        }
        catch (error) {
            res.status(401).send({message: 'Unauthorized'});
        }
    }
}