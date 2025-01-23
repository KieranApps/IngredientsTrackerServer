import myknex from '../../knexConfig.js';

/**
 * 
 * @param {number} user_id 
 * @param {string} name 
 * @returns 
 */
export async function addDishToTable(user_id, name) {
    return await myknex('dishes').insert({name, user_id});
}

/**
 * 
 * @param {string} name 
 * @param {number} user_id 
 * @returns 
 */
export async function getDishInfo(name, user_id) {
    // Eventually update this query to join schedule tables, and possible even ingredients
    // OR, create getDetailedDishInfo/getAllDishInfo for this instead
    return await myknex('dishes').select('*').where({name: name, user_id: user_id}).first(); // Only getting one dish
}

/**
 * 
 * @param {number} id 
 * @returns 
 */
export async function getDishInfoById(id) {
    return await myknex('dishes').select('*').where({id}).first();
}

/**
 * 
 * @param {number} user_id 
 * @returns 
 */
export async function getAll(user_id) {
    return await myknex('dishes').select('*').where({user_id: user_id}).where({deleted: false});
}

/**
 * 
 * @param {JSON Object} updates Object of whatever updates are to be made to the dish
 * @returns 
 */
export async function updateDish(updates) {
    return await myknex('dishes').where('id', id).update(updates);
}

/**
 * 
 * @param {number} id 
 * @param {Object} transaction 
 * @returns 
 */
export async function deleteDishInfo(id, transaction) {
    return await myknex('dishes').where('id', id).update({deleted: true}).transacting(transaction);
}

 // We do want this seperate, as it is needed on its own for removing ingredient from dish
 /**
  * 
  * @param {number} dish_id 
  * @param {Object} transaction 
  * @returns 
  */
export async function deleteDishIngredientLink(dish_id, transaction) {
    return await myknex('dish_ingredients').where('dish_id', dish_id).update({deleted: true}).transacting(transaction);
}

/**
 * 
 * @param {number}} dish_id 
 * @param {number}} ingredient_id 
 * @param {number}} amount 
 * @param {number}} unit_id 
 */
export async function addIngredientLink(dish_id, ingredient_id, amount, unit_id) {
    return await myknex('dish_ingredients').insert({ dish_id, ingredient_id, amount, unit_id });
}