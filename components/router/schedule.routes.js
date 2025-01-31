import  express from 'express';
import { addDishToSchedule, getSchedule } from '../controllers/schedule.controller.js';
import { asyncRequest } from '../utils/utils.js';
import { checkAccessToken } from '../middlewares/auth.middleware.js';

const router = express.Router({
    mergeParams: true
});

router.get('/:user_id/:startDate/:endDate', checkAccessToken, asyncRequest(getSchedule));

router.post('/add', checkAccessToken, asyncRequest(addDishToSchedule));

export default router;