import moment from "moment";

import myknex from "../../knexConfig";
import { getAllUnitsFromTable, getIngredientsForDishes } from "../services/ingredients.service";
import { addItemToShoppingList, editShoppingListItems, getShoppingListForUser } from "../services/shoppinglist.service";

export async function updateShoppingList() {
    await myknex.transaction(async (transaction) => {
        // Check next week schedule
        const nextMonday = moment().isoWeekday(8).format('YYYY-MM-DD');
        const nextSunday = moment().isoWeekday(14).format('YYYY-MM-DD');
        const upcomingDishes = await getScheduleForUser(user_id, nextMonday, nextSunday, transaction);
        const dishIds = upcomingDishes.map(x => x.dish_id);
        const units = await getAllUnitsFromTable(transaction);
        const upcomingIngredients = await getIngredientsForDishes(dishIds, transaction);
        // Process each ingredient. Convert amounts to stock unit if needed
        const itemsToAddToShoppingList = [];
        // Get users shopping list (to see if item just needs its amount updated, or added)
        const shoppingList = await getShoppingListForUser(user_id, transaction);

        let rawUpdateSql = 'CASE';
        let needUpdate = false;
        for (const ing of upcomingIngredients) {
            if (ing.unit_id !== ing.stockUnitId) {
                const ingUnit = units.find(x => x.id === ing.unit_id);
                const stockUnit = units.find(x => x.id === ing.stockUnitId);
                // Do conversion ( we force it to be doable )
                const stockItemUnit = UNIT_CONVERSION_MAPPING[stockUnit.unit];
                ing.amount = ing.amount * stockItemUnit[ingUnit.unit];
            }
            const ingredientInList = shoppingList.find(x => x.ingredient_id === ing.ingredient_id);

            if (ingredientInList && ing.amount > ing.stockAmount) {
                needUpdate = true;
                rawUpdateSql += ` WHEN id = ${ingredientInList.id} THEN ${(ing.amount - ing.stockAmount).toFixed(3)}`;
            }
            if (!ingredientInList && ing.amount > ing.stockAmount) {
                // Add to shopping list
                itemsToAddToShoppingList.push({
                    user_id: user_id,
                    item: ing.name,
                    ingredient_id: ing.ingredient_id,
                    amount: (ing.amount - ing.stockAmount).toFixed(3),
                    unit_id: ing.stockUnitId
                });
            }
        }
        if (needUpdate) {
            rawUpdateSql += ' ELSE amount END';
            await editShoppingListItems(rawUpdateSql, transaction);
        }
        if (itemsToAddToShoppingList.length > 0) {
            await addItemToShoppingList(itemsToAddToShoppingList, transaction);
        }
    });
}