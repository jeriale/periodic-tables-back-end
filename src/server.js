const { PORT = 5000 } = process.env;

const app = require("./app");
const knex = require("./db/connection");

knex.seed
  .run()
  .then((seeds) => {
    console.log("Seeded: ", seeds);
    app.listen(PORT, listener)
  })
  .catch(() => {
    console.error();
    knex.destroy();
  });

function listener() {
  console.log(`Listening on Port ${PORT}!`);
}
