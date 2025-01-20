import Joi from 'joi';

import myknex from '../../knexConfig.js';

import { addDishToTable, getDishInfo, getAll, getDishInfoById, deleteDishInfo, deleteDishIngredientLink } from '../services/dish.service.js';
import { validate } from '../utils/utils.js';
import { BadRequest, Forbidden, NotFound } from '../utils/exceptions.js';

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