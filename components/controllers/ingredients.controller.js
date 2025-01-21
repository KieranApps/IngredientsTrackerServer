import Joi from 'joi';

import { getAllUnitsFromTable, searchIngredientsTable } from '../services/ingredients.service.js';
import { validate } from '../utils/utils.js';

export async function searchIngredients(req, res){
    const schema = Joi.object({
        term: Joi.string().required(),
    });
    const { term } = validate(req.params, schema);

    const results = await searchIngredientsTable(term);

    console.log(results);

    return res.json({success: true, results});
}

export async function getAllUnits(req, res) {
    const units = await getAllUnitsFromTable();

    return res.json({success: true, units});
}