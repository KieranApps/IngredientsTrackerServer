import myknex from '../../knexConfig.js';

export async function addDishToTable(user_id, name) {
    return await myknex('dishes').insert({name, user_id});
}

export async function getDishInfo(name, user_id) {
    // Eventually update this query to join schedule tables, and possible even ingredients
    // OR, create getDetailedDishInfo/getAllDishInfo for this instead
    return await myknex('dishes').select('*').where({name: name, user_id: user_id}).first(); // Only getting one dish
}

export async function getDishInfoById(id) {
    return await myknex('dishes').select('*').where({id}).first();
}

export async function getAll(user_id) {
    return await myknex('dishes').select('*').where({user_id: user_id});
}

export async function deleteDishInfo(id) {
    return await knex('dishes').where('id', id).update({deleted: true});
}