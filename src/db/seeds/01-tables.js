exports.seed = function (knex) {
    return knex
      .raw("TRUNCATE TABLE tables RESTART IDENTITY CASCADE")
      .then(function () {
        return knex("tables")
          .insert([
            {
                table_name: "Band Room #1",
                capacity: 6
            },
            {
                table_name: "Band Room #2",
                capacity: 6
            },
            {
                table_name: "Band Room #3",
                capacity: 6
            },
            {
                table_name: "Band Room #4",
                capacity: 6
            },
            {
                table_name: "Band Room #5",
                capacity: 6
            },
            {
                table_name: "Band Room #6",
                capacity: 6
            },
            {
                table_name: "Band Room #7",
                capacity: 6
            },
            {
                table_name: "Band Room #8",
                capacity: 6
            },
            {
                table_name: "Bar #1",
                capacity: 1
            },
            {
                table_name: "Bar #2",
                capacity: 1
            },
            {
                table_name: "Bar #3",
                capacity: 1
            },
            {
                table_name: "Bar #4",
                capacity: 1
            },
            {
                table_name: "Bar #5",
                capacity: 1
            },
            {
                table_name: "Bar #6",
                capacity: 1
            },
            {
                table_name: "Patio #1",
                capacity: 4
            },
            {
                table_name: "Patio #2",
                capacity: 4
            },
            {
                table_name: "Patio #3",
                capacity: 4
            },
            {
                table_name: "Patio #4",
                capacity: 4
            },
            {
                table_name: "Patio #5",
                capacity: 4
            },
            {
                table_name: "Patio #6",
                capacity: 4
            },
          ]);
      })
  };
  