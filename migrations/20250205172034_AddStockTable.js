
export function up(knex) {
    return knex.schema.createTable('stock', (t) => {
        t.increments('id').primary();
        t.integer('user_id').unsigned().references('id').inTable('users');
        t.integer('ingredient_id').unsigned().references('id').inTable('ingredients');
        t.float('amount').notNullable(); // Amount user has in fridge, cupboards etc...
        t.integer('unit_id').unsigned().references('id').inTable('units');
        t.index(['user_id', 'ingredient_id'], 'idx_userid_ingredientid');
    });
}

export function down(knex) {
    return knex.schema.dropTable('stock');
}


/**\
 * 
 * When adding new ingredient, if NEW add to stock table
 * No seed needed
 */