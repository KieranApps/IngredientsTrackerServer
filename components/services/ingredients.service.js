import myknex from "../../knexConfig.js";

/**
 * 
 * @param {string} term 
 */
export async function searchIngredientsTable(term) {
    return await myknex('ingredients').select('*').where('name', 'like', `%${term}%`);
}

export async function getAllUnitsFromTable() {
    return await myknex('units').select('*');
}