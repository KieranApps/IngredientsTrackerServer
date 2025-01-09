import  express from 'express';
import { createUser, login } from '../controllers/user.controller.js';
import { asyncRequest } from '../utils/utils.js';

const router = express.Router({
    mergeParams: true
});

router.post('/create-user', asyncRequest(createUser));
router.post('/login', asyncRequest(login));

export default router;