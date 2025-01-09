import express from 'express';
import bodyParser from 'body-parser';

import userRoute from './user.routes.js';

const router = express.Router({
    mergeParams: true
});

router.use(bodyParser.urlencoded({
    extended: true
}));

router.use(bodyParser.json());

// Routes
router.use('/api/user', userRoute);


export default router;