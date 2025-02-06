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
export async function getAllIngredients(dish_id, transaction) {
    return myknex('dish_ingredients')
        .select('dish_ingredients.id',
            'dish_ingredients.dish_id',
            'dish_ingredients.ingredient_id',
            'dish_ingredients.amount',
            'dish_ingredients.unit_id',
            'ingredients.name as ingredient_name',
            'unit.unit')
        .where({ dish_id })
        .where({ deleted: false })
        .join('ingredients', 'ingredients.id', 'dish_ingredients.ingredient_id')
        .join('units', 'units.id', 'dish_ingredients.unit_id')
        .transacting(transaction);
}