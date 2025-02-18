import myknex from "../../knexConfig.js";

/**
 * 
 * @param {string} term 
 */
export async function searchIngredientsTable(term) {
    return await myknex('ingredients').select('*').where('name', 'like', `%${term}%`);
}

export async function getAllUnitsFromTable(transaction) {
    let query = myknex('units').select('*');
    if (transaction) {
        query = query.transacting(transaction);
    }
    return await query;
}

export async function getUnitFromTable(id) {
    return await myknex('units').select('*').where({id}).first();
}

/**
 * 
 * @param {number} dish_id 
 */
export async function getAllIngredients(dish_id, transaction) {
    let query = myknex('dish_ingredients')
        .select('dish_ingredients.id',
            'dish_ingredients.dish_id',
            'dish_ingredients.ingredient_id',
            'dish_ingredients.amount',
            'dish_ingredients.unit_id',
            'ingredients.name as ingredient_name',
            'units.unit')
        .where({ dish_id })
        .where({ deleted: false })
        .join('ingredients', 'ingredients.id', 'dish_ingredients.ingredient_id')
        .join('units', 'units.id', 'dish_ingredients.unit_id');

    if (transaction) {
        query = query.transacting(transaction);
    }
    return await query;
}

export async function getIngredientsForDishes(dish_ids, transation) {
    return await myknex('dish_ingredients').select(
        'dish_ingredients.ingredient_id',
        myknex.raw('SUM(dish_ingredients.amount) as amount'),
        'dish_ingredients.unit_id',
        'ingredients.name',
        'stock.amount as stockAmount',
        'stock.unit_id as stockUnitId',
        )
        .join('ingredients', 'ingredients.id', 'dish_ingredients.ingredient_id')
        .join('stock', 'stock.ingredient_id', 'dish_ingredients.ingredient_id')
        .groupBy(
            'dish_ingredients.ingredient_id',
            'ingredients.name',
            'dish_ingredients.unit_id',
            'stockAmount',
            'stockUnitId'
        )
        .where('dish_ingredients.dish_id', 'in', dish_ids)
        .transacting(transation);
}

/**
 * 
 * @param {Number} user_id 
 * @param {Number} ingredient_id 
 */
export async function updateUnitForIngredient(user_id, ingredient_id, unit_id, transaction) {
    return await myknex('dish_ingredients')
        .update({ unit_id })
        .where({ ingredient_id })
        .where('dishes.user_id', '=', user_id)
        .join('dishes', 'dishes.id', 'dish_ingredients.dish_id')
        .transacting(transaction);
}