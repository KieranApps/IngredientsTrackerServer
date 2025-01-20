// This table will list all ingredients available and new ones will be added here. It will list the name only

// They will be added by company ONLY, via some data set to start and further migrations as time goes on if needed.
// Avoids users adding their own which could cause issues, or user specific ingredients which could end with
// 1,000,000 entries just for onion...

export function up(knex) {
    return knex.schema.createTable('ingredients', (t) => {
        t.increments('id').primary();
        t.string('name', 255).notNullable();
        // index name only
        t.index(['name'], 'idx_name', {
            indexType: 'FULLTEXT',
        });
    });
}

export function down(knex) {
    return knex.schema.dropTable('ingredients');
}
