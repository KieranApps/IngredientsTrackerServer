import Joi from 'joi';

import { getAllUnitsFromTable, searchIngredientsTable, getAllIngredients } from '../services/ingredients.service.js';
import { validate } from '../utils/utils.js';
import myknex from '../../knexConfig.js';
import { getStockWithIds } from '../services/stock.service.js';
import { UNIT_CONVERSION_MAPPING } from '../utils/constants.js';

export async function searchIngredients(req, res){
    const schema = Joi.object({
        user_id: Joi.number().positive().required(),
        term: Joi.string().required(),
    });
    const { user_id, term } = validate(req.params, schema);

    const results = await searchIngredientsTable(term);
    
    const ingredientIds = results.map(x => x.id);
    const userStock = await getStockWithIds(user_id, ingredientIds);

    return res.json({success: true, results, stockMatchInfo: userStock});
}

export async function getAllUnits(req, res) {
    const units = await getAllUnitsFromTable();

    return res.json({success: true, units, unitMapping: UNIT_CONVERSION_MAPPING});
}

export async function getAllForDish(req, res) {
    const schema = Joi.object({
        dish_id: Joi.string().required(),
    });
    const { dish_id } = validate(req.params, schema);

    const results = await getAllIngredients(dish_id);

    return res.json({success: true, ingredients: results});
}