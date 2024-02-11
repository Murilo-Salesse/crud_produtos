const createProducts = `
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR,
    quantity INTEGER,
    color VARCHAR,
    price REAL,
    brand VARCHAR
  );
`;

module.exports = createProducts;
