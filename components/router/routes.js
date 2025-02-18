import express from 'express';
import bodyParser from 'body-parser';

import userRoute from './user.routes.js';
import authRoute from './auth.routes.js';
import dishRoute from './dish.routes.js';
import ingredientRoute from './ingredients.routes.js';
import scheduleRoute from './schedule.routes.js'
import stockRoute from './stock.routes.js';
import shoppingListRoute from './shoppinglist.routes.js';

const router = express.Router({
    mergeParams: true
});

router.use(bodyParser.urlencoded({
    extended: true
}));

router.use(bodyParser.json());

// Routes
router.use('/api/user', userRoute);
router.use('/api/auth', authRoute);
router.use('/api/dish', dishRoute);
router.use('/api/ingredients', ingredientRoute);
router.use('/api/schedule', scheduleRoute);
router.use('/api/stock', stockRoute);
router.use('/api/shoppinglist', shoppingListRoute);


export default router;