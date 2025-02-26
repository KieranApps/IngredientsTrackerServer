import myknex from '../../knexConfig.js';

export async function getShoppingListForUser(user_id, transaction) {
    let query = myknex('shopping_list').select('shopping_list.*', 'units.unit').where({ user_id }).leftJoin('units', 'units.id', 'shopping_list.unit_id');
    if (transaction) {
        query = query.transacting(transaction);
    }
    return await query;
}

export async function getShoppingListItem(user_id, item) {
    return await myknex('shopping_list').select('*').where({ user_id }).where({ item }).first();
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

export async function editShoppingListItem(id, info) {
    return await myknex('shopping_list').update(info).where({ id });
}

export async function removeShoppingListItemFromTable(id) {
    return await myknex('shopping_list').del().where({ id });
}