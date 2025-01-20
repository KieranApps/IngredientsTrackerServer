
export function up(knex) {
    return knex.schema.createTable('schedules', (t) => {
        t.increments('id').primary();
        t.integer('user_id').unsigned().references('id').inTable('users');
        t.integer('dish_id').unsigned().references('id').inTable('dishes');
        t.datetime('date').notNullable();
        t.boolean('completed').defaultTo(false);
        t.index(['user_id'], 'idx_userid');
    });
}

export function down(knex) {
    return knex.schema.dropTable('schedules');
}
