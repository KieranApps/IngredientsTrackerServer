import Joi from 'joi';
import moment from 'moment';
import myknex from '../../knexConfig.js';

import { validate } from '../utils/utils.js';
import { BadRequest } from '../utils/exceptions.js';
import { addIngredientToStock, checkIngredientInStock, getStockWithIds, getUsersStock, saveUpdatedStockAmount, updateStockInfo } from '../services/stock.service.js';
import { getAllIngredients, updateUnitForIngredient } from '../services/ingredients.service.js';
import { UNIT_CONVERSION_MAPPING } from '../utils/constants.js';
import { updateShoppingList } from '../utils/helpers.js';

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
        useTotal: Joi.bool(),
    });
    const { user_id, ingredient_id, amount, unit_id, useTotal } = validate(req.body, schema);
    // Can only have one of an ingredient in stock(i.e., two enties of pork steaks in pcs and kg is NOT allowed)

    const ingredientInStock = await checkIngredientInStock(user_id, ingredient_id);
    if (ingredientInStock) {
        throw new BadRequest('Cannot have multiple instances of the same ingredient in stock list. Please edit either the amount or Unit');
    }
    if (useTotal) {
        // Get the ingedient for all user dishes and add up amount (we can do this since its all forced. Just need to do the conversions if applicable)
    }
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
        return await saveUpdatedStockAmount(rawSql, transaction);
    });

    await updateShoppingList();

    return res.json({ success: true, updateInfo, manualCheck });
}

export async function editStock(req, res) {
    // And also then, if editing the unit on the stock, it can edit all the units in the ingredients
    // Leave it if its convertible. i.e., going from ml to L on the stock thing then all can be kept as ml, or L which ever is in the dish ingredients
    // This is dish_ingredient. Can use fancy SWL links to splice it all together with the user ID, ingredient ID
    const schema = Joi.object({
        user_id: Joi.number().positive().required(),
        ingredient_id: Joi.number().positive().required(),
        amount: Joi.number().positive(),
        unitInfo: Joi.object().keys({
            unit_id: Joi.number().positive().required(),
            unit: Joi.string().required()
        }),
    });

    const { user_id, ingredient_id, amount, unitInfo } = validate(req.body, schema);

    const result = await myknex.transaction(async (transaction) => {
        const existingStock = await checkIngredientInStock(user_id, ingredient_id, transaction);
        if (!existingStock) {
            throw new BadRequest("Stock item does not exist");
        }
        if ( (unitInfo && unitInfo.unit_id === existingStock.unit_id)  || amount === existingStock.amount) {
            return; // Values the same, so ignore
        }
        
        const checkUnits = () => {
            if (!unitInfo) {
                return false; // We are saving the amount
                // Cant check since we haae no unit info from end point
            }
            // Check for unit stuff
            if ((!UNIT_CONVERSION_MAPPING[existingStock.unit] || !UNIT_CONVERSION_MAPPING[unitInfo.unit])) {
                // Not convertible either before or after (or both but different unit), so change all ingredients to be the new
                return true;
            }

            // Check if old/new convertible to eachother
            if (UNIT_CONVERSION_MAPPING[existingStock.unit][unitInfo.unit]) { // Works both way, from kg -> g, or g -> kg
                return false; // The conversion works (for example going from gram to kilogram on the stock) so we can ignore
            }

            // At this point should be for swapping to a new convertible type, but convertable from old -> new or new -> old
            // I.e., going from g -> ml
            // So change all ingredient units to match the stock
            return true;
        }

        const changeIngredients = checkUnits();

        if (changeIngredients) {
            // Update all ingredients (user has been warned this will change all)
            await updateUnitForIngredient(user_id, ingredient_id, unitInfo.unit_id, transaction);
        }

        // Save the updates
        const updates = {};
        if (amount) {
            updates['amount'] = amount;
        }
        if (unitInfo && unitInfo.unit_id) {
            updates['unit_id'] = unitInfo.unit_id;
        }
        // ALWAYS change the shopping list unit to match stock (if exists)
        /**
         * 
         * 
         * 
         * 
         * 
         * 
         * 
         * 
         */
        return await updateStockInfo(user_id, ingredient_id, updates, transaction);
    });
    // If editing the unit of the stock, (and is not a convertible) then put a little popup to the user to say this will change ALL ingredient units for all dishes
    // If acknowledge then call this end point
    return res.json({ success: true, result });
}