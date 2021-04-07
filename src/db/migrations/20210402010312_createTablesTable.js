exports.up = function (knex) {
    return knex.schema.createTable("tables", (table) => {
      table.increments("table_id").primary();
      table.string("table_name", null).notNullable();
      table.integer("capacity", null).notNullable();
      table.integer("reservation_id", null);
      table.foreign("reservation_id").references("reservation_id").inTable("reservations");
      table.timestamps(true, true);
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable("tables");
  };
  
