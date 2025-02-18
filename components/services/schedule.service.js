import myknex from '../../knexConfig.js';

/**
 * 
 * @param {number} user_id 
 * @param {Date} startDate 
 * @param {Date} endDate 
 */
export async function getScheduleForUser(user_id, startDate, endDate, transaction) {
    let query =  myknex('schedules').select(
        'schedules.id', 'schedules.user_id', 'schedules.dish_id', 'schedules.date', 'schedules.completed',
        'dishes.name'
    ).join('dishes', 'dishes.id', 'schedules.dish_id').where('schedules.user_id', '=', user_id).where('date', '>=', startDate).where('date', '<=', endDate);

    if (transaction) {
        query = query.transacting(transaction);
    }

    return await query;
}

/**
 * 
 * @param {number} user_id 
 * @param {number} dish_id 
 * @param {Date} date 
 * @returns 
 */
export async function addNewDishToSchedule(user_id, dish_id, date) {
    return await myknex('schedules').insert({ user_id, dish_id, date });
}

/**
 * 
 * @param {number} user_id 
 * @param {number} dish_id 
 * @param {Date} date 
 * @returns 
 */
export async function editDishScheduleDate(user_id, dish_id, date) {
    return await myknex('schedules').update({ dish_id: dish_id }).where({ user_id : user_id }).where({ date : date });
}

/**
 * 
 * @param {number} dish_id 
 * @param {Date} date 
 * @returns 
 */
export async function removeDishFromSchedule(dish_id, date) {
    return await myknex('schedules').del().where();// dish_id = dish_id and date > date(param) i.e., in the future
}