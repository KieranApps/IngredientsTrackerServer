import myknex from "../../knexConfig.js";

/**
 * 
 * @param {string} term 
 */
export async function searchIngredientsTable(term) {
    return await myknex('ingredients').select('*').where('name', 'like', `%${term}%`);
}

export async function getAllUnitsFromTable() {
    return await myknex('units').select('*');
}

/**
 * 
 * @param {number} dish_id 
 */
export async function getAllIngredients(dish_id) {
    return myknex('dish_ingredients')
        .select('dish_ingredients.id',
            'dish_ingredients.dish_id',
            'dish_ingredients.ingredient_id',
            'dish_ingredients.amount',
            'dish_ingredients.unit_id',
            'ingredients.name as ingredient_name')
        .where({ dish_id })
        .join('ingredients', 'ingredients.id', 'dish_ingredients.ingredient_id');
}