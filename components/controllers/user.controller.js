import dotenv from 'dotenv';
dotenv.config();

import Joi from 'joi';
import jwt from 'jsonwebtoken';

import { comparePasswords, hashPassword, validate } from '../utils/utils.js';
import { InvalidParameters } from '../utils/exceptions.js';
import { addUserToTable, getUserByEmail, getAllUserInfoByEmail } from '../services/user.service.js';

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

export async function login(req, res) {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    });
    const { email, password } = validate(req.body, schema);

    const userInfo = await getAllUserInfoByEmail(email);
    const samePass = await comparePasswords(password, userInfo.password);

    if (!samePass) {
        return res.json({success: false, message: 'Invalid login'});
    }

    // Sort out JWT and auth
    const accessToken = jwt.sign({id: userInfo.id, email: email}, process.env.JWT_SECRET, {expiresIn: '15m'}); // Last 15 mins
    const refreshToken = jwt.sign({id: userInfo.id, email: email}, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'}); // Last one month, refresh if older than a day. If older than 30, log out on app

    return res.json({success: true, tokens: {
        accessToken: accessToken,
        refreshToken: refreshToken  
        }
    })
}