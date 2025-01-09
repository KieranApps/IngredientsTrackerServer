import Joi from 'joi';

import { hashPassword, validate } from '../utils/utils.js';
import { InvalidParameters } from '../utils/exceptions.js';
import { addUserToTable, getUserByEmail } from '../services/user.service.js';

const validPassword = (password) => {
    if(password.length < 8 || password.length > 100){
        return false;
    }
    if(password.search(/[a-z]/) === -1){
        return false;
    }
    if(password.search(/[A-Z]/) === -1){
        return false;
    }
    if(password.search(/[0-9]/) === -1){
        return false;
    }
    return true;
};

export async function createUser(req, res) {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required()
    });
    const { name, email, password } = validate(req.body, schema);

    // Check email doesnt exist
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        return res.json('Email in use');
    }

    if (!validPassword(password))
    {
        throw new InvalidParameters('Password does not meet criteria.');
    }

    const hashedPassword = await hashPassword(password);

    const result = await addUserToTable(name, email, hashedPassword);

    return res.json(result);
};