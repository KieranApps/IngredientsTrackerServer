import Joi from 'joi';

import { validate } from '../utils/utils.js';
import { BadRequest, Forbidden, NotFound } from '../utils/exceptions.js';
import { addItemToShoppingList, getShoppingListForUser, getShoppingListItem, removeShoppingListItemFromTable } from '../services/shoppinglist.service.js';


export async function getShoppingList(req, res) {
    const schema = Joi.object({
        user_id: Joi.number().positive().required()
    });
    
    const { user_id } = validate(req.params, schema);

    const list = await getShoppingListForUser(user_id);

    return res.json({ success: true, list });
}

export async function addToShoppingList(req, res) {
    // When a user adds something so a search on ingredients, if only one result (meaning it is the same) save it as that with ID
    // OR have a new query which does an EXACT match only rather than the %LIKE% thing
    // Maybe also search stock for it (might need new index)
    const schema = Joi.object({
        user_id: Joi.number().positive().required(),
        item: Joi.string().required(),
        amount: Joi.number().allow(null),
    });
    const { user_id, item, amount } = validate(req.body, schema);

    const exists = await getShoppingListItem(user_id, item);

    if (exists) {
        throw new BadRequest('Item already exists');
    }
    // This should only be saved when the name is set, so can have amount or not
    const [result] = await addItemToShoppingList({ user_id, item, amount });

    return res.json({ success: true, result });
}

export async function editShoppingListItem(req, res) {
    // Can only edit the amount
    const schema = Joi.object({
        id: Joi.number().positive().required(),
        user_id: Joi.number().positive().required(),
        amount: Joi.number().required()
    });
    const { id, amount } = validate(req.body, schema);

    const result = await editShoppingListItem(id, { amount });

    return res.json({success: true, result });
}

export async function removeShoppingListItem(req, res) {
    const schema = Joi.object({
        id: Joi.number().positive().required(),
    });

    const { id } = validate(req.params, schema);
    // Check if it exists first in stock before trying to add in
    const removed = await removeShoppingListItemFromTable(id);
}

export async function deleteShoppingListItem(req, res) {
    const schema = Joi.object({
        id: Joi.number().positive().required(),
    });

    const { id } = validate(req.params, schema);
    const removed = await removeShoppingListItemFromTable(id);
}