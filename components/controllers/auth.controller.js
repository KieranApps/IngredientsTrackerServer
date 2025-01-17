import dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';

import { Unauthorized } from '../utils/exceptions.js';


export async function refreshTokens(req, res) {
    const { token } = req.headers;
    let verifiedToken;
    try {
        verifiedToken = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
        // The token is invalid
        throw new Unauthorized('Invalid Tokens');
    }

    // Refresh is valid, so update access and refresh token (to allow perpetual session on mobile)
    const accessToken = jwt.sign({id: verifiedToken.id, email: verifiedToken.email}, process.env.JWT_SECRET, {expiresIn: '30m'}); // Last 15 mins
    const refreshToken = jwt.sign({id: verifiedToken.id, email: verifiedToken.email}, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'}); // Last one month, refresh if older than a day. If older than 30, log out on app
    
    return res.json({success: true, tokens: {
        accessToken: accessToken,
        refreshToken: refreshToken  
    }
});
};