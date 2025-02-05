import Joi from 'joi';

import { validate } from '../utils/utils.js';
import { BadRequest, Forbidden, NotFound } from '../utils/exceptions.js';
import { addIngredientToStock, getUsersStock } from '../services/stock.service.js';
import myknex from '../../knexConfig.js';

export async function getStock(req, res) {
    const schema = Joi.object({
        user_id: Joi.string().required(),
    });
    const { user_id } = validate(req.params, schema);

    const stock = await getUsersStock(user_id);

    return res.json({ success: true, stock });
}

export async function addToStock(req, res) {
    const schema = Joi.object({
        user_id: Joi.number().positive().required(),
        ingredient_id: Joi.number().positive().required(),
        amount: Joi.number().positive().required(),
        unit_id: Joi.number().positive().required(),
    });
    const { user_id, ingredient_id, amount, unit_id } = validate(req.body, schema);

    const [result] = await addIngredientToStock(user_id, ingredient_id, amount, unit_id);

    res.json({ success: true, result });
}

export async function subtractIngredientsFromStock(req, res) {

    const schema = Joi.object({
        user_id: Joi.number().positive().required(),
        dish_id: Joi.number().positive().required(),
    });

    const { user_id, dish_id }= validate(req.body, schema);

    // Put in a transaction
    const success = await myknex.transaction(async (transaction) => {
        // Get all ingredients and amounts
        
        // Get all stock (can use just stock from dish since we have ingredient IDs)

        // Combine units/merge into one as much as possible

        // Subtract ingredients on dish from stock amounts with correct units

        // Save new stock amount
    });

    return res.json({ success: true, success });
}