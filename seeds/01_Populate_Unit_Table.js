/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
    const { count } = await knex('units').count('* as count').first();
    if (count > 0){
        console.log("Entries found in the 'units' table, skipping...");
        return;
    }

    return knex('units').insert([
        {unit: 'g'},
        {unit: 'kg'},
        {unit: 'ml'},
        {unit: 'L'},
        {unit: 'pcs'},
        {unit: 'tsp'},
        {unit: 'tbsp'},
        {unit: 'pinch'},
        {unit: 'handful'}
    ]); 
}
