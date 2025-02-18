import  express from 'express';
import { addToShoppingList, deleteShoppingListItem, editShoppingListItem, getShoppingList, removeShoppingListItem } from '../controllers/shoppinglist.controller.js';
import { asyncRequest } from '../utils/utils.js';
import { checkAccessToken } from '../middlewares/auth.middleware.js';

const router = express.Router({
    mergeParams: true
});

router.get('/:user_id', checkAccessToken, asyncRequest(getShoppingList));

router.post('/add', checkAccessToken, asyncRequest(addToShoppingList));
router.post('/edit', checkAccessToken, asyncRequest(editShoppingListItem));

router.post('/remove', checkAccessToken, asyncRequest(removeShoppingListItem)); // When removed from shopping list because bought, so add to stock
router.delete('/delete', checkAccessToken, asyncRequest(deleteShoppingListItem)); // Deleted from list, not bought

export default router;