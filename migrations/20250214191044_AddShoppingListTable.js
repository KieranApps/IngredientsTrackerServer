
export function up(knex) {
  // Construct like this:
  /**
   * userId
   * string column for name not nullable
   * column for ingredient ID, nullable (allows to add random this, like haribo, rubber gloves to the list)
   * int amount (can be nullable)
   * unit ID nullable
   */
  return knex.schema.createTable('shopping_list', (t) => {
    t.increments('id').primary();
    t.integer('user_id').unsigned().references('id').inTable('users');
    t.string('item', 255).notNullable();
    t.integer('ingredient_id')
    t.float('amount');
    t.integer('unit_id');
    t.index(['user_id', 'item'], 'idx_userid_item');
});
};
 
export function down(knex) {
    return knex.schema.dropTable('shopping_list');
};
