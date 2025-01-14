import  express from 'express';
import { refreshTokens } from '../controllers/auth.controller.js';
import { asyncRequest } from '../utils/utils.js';

const router = express.Router({
    mergeParams: true
});

router.get('/refresh', asyncRequest(refreshTokens));

export default router;