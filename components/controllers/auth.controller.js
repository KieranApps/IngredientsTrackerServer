import dotenv from 'dotenv';
dotenv.config();

import Joi from 'joi';
import jwt from 'jsonwebtoken';

import { validate } from '../utils/utils.js';
import { InvalidParameters } from '../utils/exceptions.js';


export async function checkRefreshToken(req, res) {
    return;
};