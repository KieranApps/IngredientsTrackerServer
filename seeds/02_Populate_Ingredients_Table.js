import { ingredients } from '../seedInfo/IngredientsSeedFile.js';

export async function seed(knex) {
    
    const { count } = await knex('ingredients').count('* as count').first();
    if (count > 0){
        console.log("Entries found in the 'ingredients' table, skipping...");
        return;
    }

    const ingredientNames = new Set(); // Set to prevent dupes
    for (const recipe of ingredients) {
        for (const ingredient of recipe.ingredients) {
            ingredientNames.add(ingredient);
        }
    }

    // Capitalise the words
    const capitalise = (str) => {
        let splitStr = str.toLowerCase().split(' ');
        for (let i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);    
        }
        return splitStr.join(' ');
    };


    const nameArray = [];
    for (let ingredient of ingredientNames) {
        nameArray.push({ name: capitalise(ingredient) });
    }

    return knex('ingredients').insert(nameArray); 
}