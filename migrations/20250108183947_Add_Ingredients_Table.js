// This table will list all ingredients available and new ones will be added here. It will list the name only

export function up(knex) {
    return knex.schema.createTable('ingredients', (t) => {
        t.increments('id').primary();
        t.string('name', 255).notNullable();
    });
}

export function down(knex) {
    return knex.schema.dropTable('ingredients');
}
