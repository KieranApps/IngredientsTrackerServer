import Joi from 'joi';

import { getAllUnitsFromTable, searchIngredientsTable, getAllIngredients } from '../services/ingredients.service.js';
import { validate } from '../utils/utils.js';
import myknex from '../../knexConfig.js';

export async function searchIngredients(req, res){
    const schema = Joi.object({
        term: Joi.string().required(),
    });
    const { term } = validate(req.params, schema);

    const results = await searchIngredientsTable(term);

    return res.json({success: true, results});
}

export async function getAllUnits(req, res) {
    const units = await getAllUnitsFromTable();

    return res.json({success: true, units});
}

export async function getAllForDish(req, res) {
    const schema = Joi.object({
        dish_id: Joi.string().required(),
    });
    const { dish_id } = validate(req.params, schema);

    const results = await getAllIngredients(dish_id);

    return res.json({success: true, ingredients: results});
}