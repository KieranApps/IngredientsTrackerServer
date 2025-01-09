import bcrypt from 'bcrypt';

import { InvalidParameters } from './exceptions.js';

export const hashPassword = async (raw) => {
    const saltRounds = 12;
    const hash = await bcrypt.hash(raw, saltRounds).then((hash) => {
        return hash;
    }).catch((err) =>{
        return false;
    });
    return hash;
};

export async function comparePasswords(sent, stored){
    const result = await bcrypt.compare(sent, stored).then((result) => {
        return result;
    });
    return result;
};

export function asyncRequest(handler) {
    return async function(req, res, next){
        try {
            const result = await handler(req, res);
            if(!res.headersSent){
                return res.status(200).send(result);
            }
            return next();
        }catch (error) {
            return next(error);
        }
    }
};

export function validate(value, schema){
    const validation = schema.validate(value);
    if (validation.error) {
        throw new InvalidParameters(validation.error);
    }
    return validation.value;
};