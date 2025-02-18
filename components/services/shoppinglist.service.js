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

export async function editShoppingListItems(rawSql, transaction) {
    return await myknex('shopping_list').update({ amount: myknex.raw(rawSql) }).transacting(transaction);
}