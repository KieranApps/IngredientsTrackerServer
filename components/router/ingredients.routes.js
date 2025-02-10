import  express from 'express';
import { getAllForDish, getAllUnits, searchIngredients } from '../controllers/ingredients.controller.js';
import { asyncRequest } from '../utils/utils.js';
import { checkAccessToken } from '../middlewares/auth.middleware.js';

const router = express.Router({
    mergeParams: true
});

router.get('/search/:user_id/:term', checkAccessToken, asyncRequest(searchIngredients));
router.get('/units', checkAccessToken, asyncRequest(getAllUnits));
router.get('/all/:dish_id', checkAccessToken, asyncRequest(getAllForDish));

export default router;