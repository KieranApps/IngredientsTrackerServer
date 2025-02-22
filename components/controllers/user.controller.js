import dotenv from 'dotenv';
dotenv.config();

import Joi from 'joi';
import jwt from 'jsonwebtoken';

import { comparePasswords, hashPassword, validate } from '../utils/utils.js';
import { BadRequest, InvalidParameters, NotFound, Unauthorized } from '../utils/exceptions.js';
import { addUserToTable, getUserByEmail, getAllUserInfoByEmail, getAllUserInfo, saveUpdatedPassword, updateUserInfo, getUserInfoFromReset } from '../services/user.service.js';
import moment from 'moment';

const EMAIL_REGEX = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-z]{2,}$');

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

    // Validate email to ensure it IS an email
    if (!EMAIL_REGEX.test(email)) {
        throw new BadRequest('Not valid email')
    }
    // Check email doesnt exist
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        throw new BadRequest('Email in use')
    }

    if (!validPassword(password))
    {
        throw new BadRequest('Password does not meet criteria.');
    }

    const hashedPassword = await hashPassword(password);

    const result = await addUserToTable(name, email, hashedPassword);

    return res.json({success: true, result});
};

export async function login(req, res) {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    });
    const { email, password } = validate(req.body, schema);

    const userInfo = await getAllUserInfoByEmail(email);
    if (!userInfo) {
        return res.json({success: false, message: 'User not found'});
    }
    
    const samePass = await comparePasswords(password, userInfo.password);
    if (!samePass) {
        return res.json({success: false, message: 'Invalid login'});
    }

    // Sort out JWT and auth
    const accessToken = jwt.sign({id: userInfo.id, email: email}, process.env.JWT_SECRET, {expiresIn: '30m'}); // Last 15 mins
    const refreshToken = jwt.sign({id: userInfo.id, email: email}, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'}); // Last one month, refresh if older than a day. If older than 30, log out on app

    return res.json({
        success: true, 
        tokens: {
            accessToken: accessToken,
            refreshToken: refreshToken  
        },
        userInfo: {
            id: userInfo.id,
            email: userInfo.email,
            name: userInfo.name
        }
    });
}

export async function getUserInfo(req, res) {
    const schema = Joi.object({
        email: Joi.string().required(),
    });
    const { email } = validate(req.query, schema);

    const userInfo = await getUserByEmail(email);
    if (!userInfo) {
        return res.json({success: false, message: 'User not found'}); // Shouldnt happen, but just in case
    }
    return res.json(userInfo);
}

export async function updatePassword(req, res) {
    const schema = Joi.object({
        user_id: Joi.number().positive().required(),
        email: Joi.string().required(),
        newPassword: Joi.string().required(),
        newPassCheck: Joi.string().required(),
        oldPassword: Joi.string().required()
    });
    const { user_id, email, newPassword, newPassCheck, oldPassword } = validate(req.body, schema);
    
    const userInfo = await getAllUserInfo(user_id, email);

    if (newPassword !== newPassCheck) {
        throw new BadRequest('Passwords do not match.');
    }
    if (!validPassword(password))
    {
        throw new BadRequest('Password does not meet criteria.');
    }

    const samePass = await comparePasswords(oldPassword, userInfo.password);
    if (!samePass) {
        throw new BadRequest('Incorrect password.');
    }
    const hashedPassword = await hashPassword(newPassword);
    const result = await saveUpdatedPassword(user_id, email, hashedPassword).then(() => {
        return true;
    }).catch(() => {
        return false;
    });

    return res.json({success: result});
}

export async function forgotPassword(req, res) {
    const schema = Joi.object({
        email: Joi.string().required()
    });
    const { email } = validate(req.body, schema);

    const userInfo = await userService.getAllUserInfoByEmail(email);
    if(!userInfo){
        throw new NotFound('User', 'Not Found', 'User not found')
    }

    const reset_expiry = moment().add(30, 'mins');
    const reset_id = uuidv4();
    
    const updated = await updateUserInfo(userInfo.id, reset_id, reset_expiry);
    if(updated !== true){
        return updated;
    }

    const values = {
        username: userInfoJSON.username,
        resetPasswordLink: `${SITE_DOMAIN}/password/${reset_id}`,
        logo: LOGO_EXTERNAL
    };

    const emailContent = await renderEmail('password', values, 'passwordReset.mustache');
    
    const emailSettings = {
        from: 'company <noreply@copmany.app>',
        to: email,
        subject: 'Password Reset',
        text: 'Please view in HTML to view the reset button!',
        html: emailContent
    }; 
    /**
     * 
     * Have the email open the link to reset in a webview in the app???
     * 
     */
    try {
        const email = await emailService.sendEmail('noreply@groopr.app', emailSettings);
        return email;
    } catch (error) {
        return error;
    }
}

export async function resetPassword(req, res) {
    const schema = Joi.object({
        reset_id: Joi.string().required(),
        password: Joi.string().required()
    });
    const { reset_id, password } = validate(req.body, schema);

    const date = moment();
    const user = await getUserInfoFromReset(reset_id);

    if(!user){
        throw new NotFound('User', 'Not Found', 'User not found')
    }

    if(date.isAfter(user.reset_expiry)){
        return Unauthorized('Token expired');
    }

    const hashedPassword = await hashPassword(password);

    const result = await saveUpdatedPassword(user.id, user.email, hashedPassword).then(() => {
        return true;
    }).catch(() => {
        return false;
    });

    return res.json({ success: result });
}
