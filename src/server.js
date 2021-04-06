const { PORT = 5000 } = process.env;

const app = require("./app");
const knex = require("./db/connection");

knex.migrate
  .rollback()
  .then((migrations) => {
    console.log("Rolled Back: ", migrations);
    knex.migrate
      .latest()
      .then((migrations) => {
        console.log("Migrated Latest:", migrations);
        knex.seed
          .run()
          .then((seeds) => {
            console.log("Seeded: ", seeds);
            app.listen(PORT, listener)
          })
          .catch((error) => {
            console.error(error);
            knex.destroy();
          })
      })
      .catch((error) => {
        console.error(error);
        knex.destroy();
      });
  })
  .catch((error) => {
    console.error(error);
    knex.destroy();
  });

function listener() {
  console.log(`Listening on Port ${PORT}!`);
}
