exports.seed = function (knex) {
    return knex
      .raw("TRUNCATE TABLE tables RESTART IDENTITY CASCADE")
      .then(function () {
        return knex("tables")
          .insert([
            {
                table_name: "#1",
                capacity: 6
            },
            {
                table_name: "#2",
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
                capacity: 6
            },
            {
                table_name: "Patio #2",
                capacity: 6
            },
            {
                table_name: "Patio #3",
                capacity: 2
            },
            {
                table_name: "Patio #4",
                capacity: 2
            },
            {
                table_name: "Patio #5",
                capacity: 2
            },
            {
                table_name: "Patio #6",
                capacity: 2
            },
            {
                table_name: "Stage Room #1",
                capacity: 4
            },
            {
                table_name: "Stage Room #2",
                capacity: 4
            },
            {
                table_name: "Stage Room #3",
                capacity: 4
            },
            {
                table_name: "Stage Room #4",
                capacity: 4
            },
            {
                table_name: "Stage Room #5",
                capacity: 4
            },
            {
                table_name: "Stage Room #6",
                capacity: 4
            },
            {
                table_name: "Stage Room #7",
                capacity: 4
            },
            {
                table_name: "Stage Room #8",
                capacity: 4
            },
            {
                table_name: "Stage Room #9",
                capacity: 4
            },
            {
                table_name: "Stage Room #10",
                capacity: 4
            },
          ]);
      })
  };
  