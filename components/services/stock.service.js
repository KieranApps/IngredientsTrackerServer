import myknex from '../../knexConfig.js';

export async function getUsersStock(user_id) {
    return await myknex('stock').select('*').where({ user_id: user_id });
}

export async function checkForIngredient(user_id, ingredient_id) {
    return await myknex('stock').select('*').where({ user_id: user_id }).where({ ingredient_id: ingredient_id }).first();
}

export async function addIngredientToStock(user_id, ingredient_id, amount, unit_id) {
    return await myknex('stock').insert({ user_id, ingredient_id, amount, unit_id });
}

export async function getStockWithIds(user_id, ingredient_ids, transaction) {
    return await myknex('stock').select('stock.*', 'units.unit')
        .join('units', 'units.id', 'stock.unit_id')
        .where({ user_id: user_id })
        .where('ingredient_id', 'in', ingredient_ids)
        .transacting(transaction);
}

export async function saveUpdatedStockAmount(ids, data, transaction) {
    return await myknex('stock').update({ amount: myknex.raw(data) }).transacting(transaction);
}