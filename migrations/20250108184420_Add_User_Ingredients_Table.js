// This table will list all the ingredients a given User needs for ALL of their dishes in their 'library'
// It will be just IDs listing user ids and ingredients

export function up(knex) {
    // return knex.schema.createTable('user_ingredients', (t) => {
    //     t.increments('id').primary();
    //     t.integer('user_id').unsigned().references('id').inTable('users');
    //     t.integer('ingredient_id').unsigned().references('id').inTable('ingredients');
    // });
}

export function down(knex) {
    // return knex.schema.dropTable('user_ingredients');
}
