exports.up = function (knex) {
  return knex.schema.createTable("reservations", (table) => {
    table.increments("reservation_id").primary();
    table.string("status", "booked").notNullable();
    table.string("first_name", null).notNullable();
    table.string("last_name", null).notNullable();
    table.string("mobile_number", null).notNullable();
    table.date("reservation_date", null).notNullable();
    table.time("reservation_time", null).notNullable();
    table.integer("people", null).unsigned().notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("reservations");
};
