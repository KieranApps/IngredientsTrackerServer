import Joi from 'joi';

import { addDishToTable } from '../services/dish.service.js';
import { validate } from '../utils/utils.js';
import { Unauthorized } from '../utils/exceptions.js';

export async function addDish(req, res) {
    const schema = Joi.object({
        id: Joi.number().positive().required(),
        name: Joi.string().required()
    });
    const { id, name } = validate(req.body, schema);

    return res.json({success: true});
}