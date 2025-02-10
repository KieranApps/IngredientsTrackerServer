import Joi from 'joi';

import myknex from '../../knexConfig.js';

import { addDishToTable, getDishInfo, getAll, getDishInfoById, deleteDishInfo, deleteDishIngredientLink, addIngredientLink } from '../services/dish.service.js';
import { validate } from '../utils/utils.js';
import { BadRequest, Forbidden, NotFound } from '../utils/exceptions.js';
import { addIngredientToStock, checkForIngredient } from '../services/stock.service.js';
import { UNIT_CONVERSION_MAPPING } from '../utils/constants.js';
import { getUnitFromTable } from '../services/ingredients.service.js';

export async function addDish(req, res) {
    const schema = Joi.object({
        user_id: Joi.number().positive().required(),
        name: Joi.string().required()
    });
    const { user_id, name } = validate(req.body, schema);
    // Check if dish exists with this name for this user
    const dishExist = await getDishInfo(name, user_id);

    if (dishExist) {
        throw new BadRequest('Dish already exists');
    }
    const [result] = await addDishToTable(user_id, name);

    return res.json({success: true, info: {
        id: result,
        name: name,
        user_id: user_id
    }});
}

export async function getAllDishes(req, res) {
    const schema = Joi.object({
        user_id: Joi.number().positive().required(),
    });
    const { user_id } = validate(req.params, schema);

    const allDishes = await getAll(user_id);

    return res.json({success: true, dishes: allDishes });
}

export async function getDish(req, res) {

}

export async function editDish(req, res) {
    const schema = Joi.object({
        id: Joi.number().positive().required(),
        user_id: Joi.number().positive().required(),
        name: Joi.string().required()
    });
    const { id, user_id, name } = validate(req.body, schema);
}

export async function deleteDish(req, res) {
    const schema = Joi.object({
        dish_id: Joi.number().positive().required(),
        user_id: Joi.number().positive().required(),
    });
    const { dish_id, user_id } = validate(req.params, schema);
    const dish = await getDishInfoById(dish_id);

    if (!dish){
        throw new NotFound('Dish', 'Could not find dish to delete');
    }

    if (user_id != dish.user_id) {
        throw new Forbidden('User does not have permission to delete dish');
    }

    // If dish found, and you are user that owns it, perform delete
    await myknex.transaction(async (transaction) => {
        // Mark dish as deleted
        const dishDeleted = await deleteDishInfo(dish_id, transaction);
        // Mark dish_ingredient links as deleted
        const linkDeleted = await deleteDishIngredientLink(dish_id, transaction);

        // Delete from schedule
        
    });
    
    return res.json({succes: true});
}

export async function addIngredient(req, res) {
    const schema = Joi.object({
        user_id: Joi.number().positive().required(),
        dish_id: Joi.number().positive().required(),
        ingredient_id: Joi.number().positive().required(),
        amount: Joi.number().positive().required(),
        unit_id: Joi.number().positive().required(),
    });
    const { user_id, dish_id, ingredient_id, amount, unit_id } = validate(req.body, schema);
    
    // Add the ingredient to the stock table if not already in
    const ingredientInStock = await checkForIngredient(user_id, ingredient_id);
    if (!ingredientInStock) {
        // Add it to the stock list
        await addIngredientToStock(user_id, ingredient_id, 0 /**Assume 0 stock, user can adjust or ignore to start */, unit_id);
    }

    if (ingredientInStock && ingredientInStock.unit_id !== unit_id) { // In theory should never happen, as we auto fill and lock the unit select
        const stockItemUnit = UNIT_CONVERSION_MAPPING[ingredientInStock.unit];
        const ingredientUnit = await getUnitFromTable(unit_id);
        if (!stockItemUnit || (stockItemUnit && !stockItemUnit[ingredientUnit.unit])) {
            throw new BadRequest('Unit of ingredient must match that of the stock');
        }
    }
    /**
     * Worth looking into: Check if the ingredient exists in stock, if it does, check the units match and only allow a save if the unit is the same (or convertable)
     * ^ On add ingredient endpoint
     * This will force it all to work together well for adding/subtracting and working out the shopping list even if it is more restrictive
     * It will overall make the automation better, giving the user less to do
     * 
     * DO THIS ^^^
     * And also then, if editing the unit on the stock, it can edit all the units in the ingredients
     * User WONT be able to edit units in the ingredients, can edit amounts
     * 
     * Can still keep the auto add from first time ingredient to stock
     * 
     * Maybe a new table, user_ingredient_unit link. So when getting ingredients (searching). We can join this table using ingredient and user ID
     * 
     * Can maybe just user stock table, if not exists, allow any. If does exist, use that unit ID and auto populate the drop down and lock it
     * to get the unit they use for this ingredient if a repeat, then auto populate and lock the unit select input
     */
    const [result] = await addIngredientLink(dish_id, ingredient_id, amount, unit_id);

    res.json({ success: true, result });

}