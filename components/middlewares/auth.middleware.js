import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import moment from 'moment';

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

        const expiry = verifiedToken.exp;
        const now = moment();
        if (now.isAfter(expiry * 1000)) {
            // Current date is AFTER expiry, so token is expired
            throw new Unauthorized('Invalid Tokens');
        }

        // Is valid and in date, so move on to endpoint
        next();
    }catch (error) {
        return next(error);
    }
    
};