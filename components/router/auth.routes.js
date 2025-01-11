import  express from 'express';
import { checkRefreshToken } from '../controllers/auth.controller.js';
import { asyncRequest } from '../utils/utils.js';

const router = express.Router({
    mergeParams: true
});

router.get('/refresh', asyncRequest(checkRefreshToken));

export default router;