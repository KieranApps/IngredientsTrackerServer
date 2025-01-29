import Joi from 'joi';
import moment from 'moment';

import { validate } from '../utils/utils.js';
import { BadRequest, Forbidden, NotFound } from '../utils/exceptions.js';
import { addNewDishToSchedule, getScheduleForUser } from '../services/schedule.service.js';
import { getDishInfoById } from '../services/dish.service.js';

export async function getSchedule(req, res) {
    const schema = Joi.object({
        userId: Joi.number().positive().required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
    });
    const { userId, startDate, endDate } = validate(req.params, schema);

    const results = await getScheduleForUser(userId, startDate, endDate);

    return res.json({success: true, results });
}

export async function addDishToSchedule(req, res) {
    const schema = Joi.object({
        user_id: Joi.number().positive().required(),
        dish_id: Joi.number().positive().required(),
        date: Joi.date().required(),
    });
    const { user_id, date, dish_id } = validate(req.body, schema);

    // Check if dish exists
    const dishExists = await getDishInfoById(dish_id);
    if (!dishExists) {
        throw new BadRequest('Dish does not exist');
    }

    // Check if date is in future
    const currentDate = moment();
    const dateGiven = moment(date);
    if (dateGiven.isBefore(currentDate)) {
        throw new BadRequest('Cannot add dish to past date');
    }
    
    const result = await addNewDishToSchedule(user_id, dish_id, date);
    return res.json({success: true, result });
}