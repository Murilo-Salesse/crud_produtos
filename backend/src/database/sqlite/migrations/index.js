const sqliteConnection = require('../../sqlite');
const createProducts = require('./createProducts');

async function migrationsRun() {
  const schemas = [createProducts].join('');

  sqliteConnection()
    .then((db) => db.exec(schemas))
    .catch((error) => console.log(error));
}

module.exports = migrationsRun;
