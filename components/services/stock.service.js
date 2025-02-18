import myknex from '../../knexConfig.js';

export async function getUsersStock(user_id) {
    return await myknex('stock')
        .select('stock.*', 'ingredients.name as ingredient_name', 'units.unit')
        .where({ user_id: user_id })
        .join('ingredients', 'ingredients.id', 'stock.ingredient_id')
        .join('units', 'units.id', 'stock.unit_id');
}

export async function checkIngredientInStock(user_id, ingredient_id, transaction) {
    let query = myknex('stock')
        .select('stock.*', 'units.unit')
        .join('units', 'units.id', 'stock.unit_id')
        .where({ user_id: user_id })
        .where({ ingredient_id: ingredient_id })
        .first();
    if (transaction) {
        query = query.transacting(transaction);
    }
    return await query;
}

export async function addIngredientToStock(user_id, ingredient_id, amount, unit_id) {
    return await myknex('stock').insert({ user_id, ingredient_id, amount, unit_id });
}

export async function getStockWithIds(user_id, ingredient_ids, transaction) {
    let query =  myknex('stock').select('stock.*', 'units.unit')
        .join('units', 'units.id', 'stock.unit_id')
        .where({ user_id: user_id })
        .where('ingredient_id', 'in', ingredient_ids);
    if (transaction) {
        query = query.transacting(transaction);
    }
    return await query;
}

export async function saveUpdatedStockAmount(data, transaction) {
    return await myknex('stock').update({ amount: myknex.raw(data) }).transacting(transaction);
}

export async function updateStockInfo(user_id, ingredient_id, updates, transaction) {
    return await myknex('stock').update(updates).where({ user_id }).where({ ingredient_id }).transacting(transaction);
}