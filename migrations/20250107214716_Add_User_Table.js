
export function up(knex) {
    return knex.schema.createTable('users', (t) => {
        t.increments('id').primary();
        t.string('name', 255).notNullable();
        t.string('email', 255).notNullable();
        t.string('password').notNullable();
        t.string('reset_id').nullable();
        t.datetime('reset_expiry').nullable();
        t.boolean('deleted').defaultTo(false);
        t.datetime('deleted_at');
        t.index(['email'], 'idx_email');
    });
}

export function down(knex) {
    return knex.schema.dropTable('users');
}
