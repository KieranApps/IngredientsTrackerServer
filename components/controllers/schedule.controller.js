import Joi from 'joi';
import moment from 'moment';

import { validate } from '../utils/utils.js';
import { BadRequest, Forbidden, NotFound } from '../utils/exceptions.js';
import { addNewDishToSchedule, getScheduleForUser, editDishScheduleDate} from '../services/schedule.service.js';
import { getDishInfoById } from '../services/dish.service.js';

export async function getSchedule(req, res) {
    const schema = Joi.object({
        user_id: Joi.number().positive().required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
    });
    const { user_id, startDate, endDate } = validate(req.params, schema);

    const results = await getScheduleForUser(user_id, startDate, endDate);

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
    let dateGiven = moment.utc(date);
    if (dateGiven.isBefore(currentDate)) {
        throw new BadRequest('Cannot add dish to past date');
    }
    dateGiven = dateGiven.format('YYYY-MM-DD HH:mm:ss');
    const [result] = await addNewDishToSchedule(user_id, dish_id, dateGiven);
    return res.json({success: true, result });
}

export async function editDishOnSchedule(req, res) {
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
    let dateGiven = moment.utc(date);
    if (dateGiven.isBefore(currentDate)) {
        throw new BadRequest('Cannot add dish to past date');
    }
    dateGiven = dateGiven.format('YYYY-MM-DD HH:mm:ss');
    const result = await editDishScheduleDate(user_id, dish_id, dateGiven);
    return res.json({success: true, result });
}