import myknex from '../../knexConfig.js';

export async function getShoppingListForUser(user_id, transaction) {
    let query = myknex('shopping_list').select('*').where({ user_id });
    if (transaction) {
        query = query.transacting(transaction);
    }
    return await query;
}

export async function addItemToShoppingList(info, transaction) {
    let query = myknex('shopping_list').insert(info);
    if (transaction) {
        query = query.transacting(transaction);
    }
    return await query;
}

export async function editShoppingListEntry(user_id, ingredient_id, amount, transaction) {
    let query = myknex('shopping_list').where({ user_id }).where({ ingredient_id }).update({ amount });
    if (transaction) {
        query = query.transacting(transaction);
    }
    return await query;
}