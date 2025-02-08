import  express from 'express';

import { asyncRequest } from '../utils/utils.js';
import { checkAccessToken } from '../middlewares/auth.middleware.js';
import { addToStock, getStock, subtractIngredientsFromStock } from '../controllers/stock.controller.js';

const router = express.Router({
    mergeParams: true
});

router.get('/:user_id', checkAccessToken, asyncRequest(getStock));

router.post('/add', checkAccessToken, asyncRequest(addToStock));

router.post('/decrease', checkAccessToken, asyncRequest(subtractIngredientsFromStock));

export default router