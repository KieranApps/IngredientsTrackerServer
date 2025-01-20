// This table will list the ingredients needed for a given dish
// It will be just IDs linking dishes and ingredients

export function up(knex) {
    return knex.schema.createTable('dish_ingredients', (t) => {
        t.increments('id').primary();
        t.integer('dish_id').unsigned().references('id').inTable('dishes');
        t.integer('ingredient_id').unsigned().references('id').inTable('ingredients');
        t.float('amount').notNullable();
        t.integer('unit_id').unsigned().references('id').inTable('units');
        t.boolean('deleted').defaultTo(false);
        t.datetime('deleted_at');
        t.index(['dish_id', 'ingredient_id'], 'idx_dishid_ingredientid');
    });
}

export function down(knex) {
    return knex.schema.dropTable('dish_ingredients');
}
