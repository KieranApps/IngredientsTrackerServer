
export function up(knex) {
    return knex.schema.createTable('units', (t) => {
        t.increments('id').primary();
        t.string('unit', 255).notNullable();
    });
}

export function down(knex) {
    return knex.schema.dropTable('units');
}
