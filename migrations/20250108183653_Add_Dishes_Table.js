// All users dishes will be here. Even if some are 'duplicates', each user may have a slightly different set of ingredients, recipe (when added) or name for it

export function up(knex) {
    return knex.schema.createTable('dishes', (t) => {
        t.increments('id').primary();
        t.string('name', 255).notNullable();
        t.integer('user_id').unsigned().references('id').inTable('users');
        t.boolean('deleted').defaultTo(false);
        t.datetime('deleted_at');
    });
}

export function down(knex) {
    return knex.schema.dropTable('dishes');
}
