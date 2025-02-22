import  express from 'express';
import { createUser, forgotPassword, getUserInfo, login, resetPassword, updatePassword } from '../controllers/user.controller.js';
import { asyncRequest } from '../utils/utils.js';
import { checkAccessToken } from '../middlewares/auth.middleware.js';

const router = express.Router({
    mergeParams: true
});

router.post('/create-user', asyncRequest(createUser));
router.post('/login', asyncRequest(login));
router.post('/forgotPassword', asyncRequest(forgotPassword));
router.post('/resetPassword', asyncRequest(resetPassword));

router.post('/updatePassword', checkAccessToken, asyncRequest(updatePassword));

router.get('/info', checkAccessToken, asyncRequest(getUserInfo));

export default router;