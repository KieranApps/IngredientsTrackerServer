import  express from 'express';
import { createUser } from '../controllers/user.controller.js';
import { asyncRequest } from '../utils/utils.js';

const router = express.Router({
    mergeParams: true
});

router.post('/create-user',  asyncRequest(createUser));

export default router;