import Joi from 'joi';

import { validate } from '../utils/utils.js';
import { BadRequest, Forbidden, NotFound } from '../utils/exceptions.js';
import { } from '../services/shoppinglist.service.js';


export async function getShoppingList(req, res) {

}

export async function addToShoppingList(req, res) {
    // When a user adds something so a search on ingredients, if only one result (meaning it is the same) save it as that with ID
    // OR have a new query which does an EXACT match only rather than the %LIKE% thing
    // Maybe also search stock for it (might need new index)
}

export async function editShoppingListItem(req, res) {

}

export async function removeShoppingListItem(req, res) {

}

export async function deleteShoppingListItem(req, res) {

}