import  express from 'express';
import { getAllUnits, searchIngredients } from '../controllers/ingredients.controller.js';
import { asyncRequest } from '../utils/utils.js';
import { checkAccessToken } from '../middlewares/auth.middleware.js';

const router = express.Router({
    mergeParams: true
});

router.get('/search/:term', checkAccessToken, asyncRequest(searchIngredients));
router.get('/units', checkAccessToken, asyncRequest(getAllUnits));

export default router;