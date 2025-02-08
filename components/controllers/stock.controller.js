import Joi from 'joi';

import { validate } from '../utils/utils.js';
import { BadRequest, Forbidden, NotFound } from '../utils/exceptions.js';
import { addIngredientToStock, getStockWithIds, getUsersStock, saveUpdatedStockAmount } from '../services/stock.service.js';
import myknex from '../../knexConfig.js';
import { getAllIngredients, getAllUnitsFromTable } from '../services/ingredients.service.js';
import { UNIT_CONVERSION_MAPPING } from '../utils/constants.js';

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

    const { user_id, dish_id } = validate(req.body, schema);

    let manualCheck = false;

    const updateInfo = await myknex.transaction(async (transaction) => {
        const ingredients = await getAllIngredients(dish_id, transaction);
        const stock = await getStockWithIds(user_id, ingredients.map(x => x.ingredient_id), transaction);

        const updatedStockItems = [];
        for (const item of ingredients) {
            const stockItem = stock.find((el) => {
                return el.ingredient_id === item.ingredient_id;
            });
            // Process the units (do conversions if needed)
            if (item.unit_id != stockItem.unit_id) {
                // Check if gram etc...
                const stockItemUnit = UNIT_CONVERSION_MAPPING[stockItem.unit];
                if (!stockItemUnit || (stockItemUnit && !stockItemUnit[item.unit])) { // I.e. if unit cannot be mapped to stock, then ignore
                    // Set flag for notifaction
                    manualCheck = true;
                    continue; // Skip if not the same unit (by id), or not able to do a conversion (e.g. -> g to ml)
                }

                // Always convert to whatever is in the stock unit
                item.amount = item.amount * stockItemUnit[item.unit];
            }
            
            const newAmount = stockItem.amount - item.amount <= 0 ? 0 : stockItem.amount - item.amount;
            const updatedStockItem = { ...stockItem, amount: newAmount.toFixed(3) };
            updatedStockItems.push(updatedStockItem);
        }

        let rawSql = 'CASE';
        for (const item of updatedStockItems) {
            rawSql += ` WHEN id = ${item.id} THEN ${item.amount}`;
        }
        rawSql += ' ELSE amount END';
        return await saveUpdatedStockAmount(updatedStockItems.map(x => x.ingredient_id), rawSql, transaction);
    });

    return res.json({ success: true, updateInfo, manualCheck });
}