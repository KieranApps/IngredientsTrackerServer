import  express from 'express';
import { addDish } from '../controllers/dish.controller.js';
import { asyncRequest } from '../utils/utils.js';
import { checkAccessToken } from '../middlewares/auth.middleware.js';

const router = express.Router({
    mergeParams: true
});

router.post('/add', checkAccessToken, asyncRequest(addDish))

export default router;