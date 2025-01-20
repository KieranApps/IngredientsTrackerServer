import myknex from '../../knexConfig.js';

export async function removeDishFromSchedule(dish_id, date) {
    return await myknex('schedules').del().where();// dish_id = dish_id and date > date(param) i.e., in the future
}
