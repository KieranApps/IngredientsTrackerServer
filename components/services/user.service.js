import myknex from '../../knexConfig.js';

export async function addUserToTable(name, email, password) {
    return await myknex('users').insert({name, email, password});
}

export async function getUserByEmail(email) {
    return await myknex('users').select('id', 'name', 'email').where('email', '=', email).first();
}

export async function getAllUserInfoByEmail(email) {
    return await myknex('users').select('*').where('email', '=', email).first();
}