import z from 'zod';

const userSchema = z.object({
    id: z.string({
        invalid_type_error: 'User id must be a string',
        required_error: 'User id is required'
    }).optional(),
    nombre: z.string({
        invalid_type_error: 'User name must be a string',
        required_error: 'User name is required'
    }),
    apellidos: z.string({
        invalid_type_error: 'User last name must be a string',
        required_error: 'User last name is required'
    }),
    rol: z.enum(['admin', 'user']),
    email: z.string().email({
        invalid_email_error: 'Email must be a valid email',
        required_error: 'Email is required'
    }),
    password: z.string({
        invalid_type_error: 'Password must be a string',
        required_error: 'Password is required'
    }),
});

export function validateUser(object) {
    return userSchema.safeParse(object);
}

export function validatePartialUser(object) {
    return userSchema.partial().safeParse(object);
}