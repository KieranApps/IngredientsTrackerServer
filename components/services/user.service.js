import myknex from '../../knexConfig.js';

export async function addUserToTable(name, email, password) {
    return await myknex('users').insert({name, email, password});
}

export async function updateUserInfo(id, updates) {

}

export async function getUserByEmail(email) {
    return await myknex('users').select('id', 'name', 'email').where('email', '=', email).first();
}

export async function getAllUserInfoByEmail(email) {
    return await myknex('users').select('*').where('email', '=', email).first();
}

export async function getAllUserInfo(id, email) {
    return await myknex('users').select('*').where({ user_id: id }).where('email', '=', email).first();
}

export async function saveUpdatedPassword(user_id, email, password) {
    return await myknex('stock').update({ password }).where({ user_id }).where({ email });
}

export async function getUserInfoFromReset(reset_id) {
    
}