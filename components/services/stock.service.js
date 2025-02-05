import myknex from '../../knexConfig.js';

export async function getUsersStock(user_id) {
    return await myknex('stock').select('*').where({ user_id: user_id });
}

export async function checkForIngredient(user_id, ingredient_id) {
    return myknex('stock').select('*').where({ user_id: user_id }).where({ ingredient_id: ingredient_id });
}

export async function addIngredientToStock(user_id, ingredient_id, amount, unit_id) {
    return myknex('stock').insert({ user_id, ingredient_id, amount, unit_id });
}