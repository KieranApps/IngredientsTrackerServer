import  express from 'express';
import { addDish, deleteDish, getAllDishes, getDish, addIngredient } from '../controllers/dish.controller.js';
import { asyncRequest } from '../utils/utils.js';
import { checkAccessToken } from '../middlewares/auth.middleware.js';

const router = express.Router({
    mergeParams: true
});

router.get('/:id', checkAccessToken, asyncRequest(getDish)); // Get all dish info (i.e., ingredients, schedule etc... Everything relating to it)
router.get('/all/:user_id', checkAccessToken, asyncRequest(getAllDishes));

router.post('/add', checkAccessToken, asyncRequest(addDish));
router.post('/add/ingredient', checkAccessToken, asyncRequest(addIngredient));

router.delete('/:dish_id/:user_id', checkAccessToken, asyncRequest(deleteDish));

export default router;