import myknex from '../../knexConfig.js';

export async function addDishToTable(id, name) {
    return await myknex('users').insert({name, user_id: id});
}