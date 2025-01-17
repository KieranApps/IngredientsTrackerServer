import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';

import { Unauthorized } from "../utils/exceptions.js";

// Token check
export async function checkAccessToken(req, res, next) {
    try {
        const { token } = req.headers;
        let verifiedToken;
        try {
            verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            // The token is invalid
            throw new Unauthorized('Invalid Tokens');
        }

        next();
    }catch (error) {
        return next(error);
    }
    
};