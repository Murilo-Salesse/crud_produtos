const AppError = require('../ultils/AppError');

//conexão com o banco de dados
const sqliteConnection = require('../database/sqlite');

class ProductsController {
  async create(request, response) {
    const { name, quantity, color, price, brand } = request.body;

    const database = await sqliteConnection();

    const checkProductExists = await database.get(
      'SELECT * FROM products WHERE name = ? AND color = ?',
      [name, color]
    );

    if (checkProductExists) {
      throw new AppError('Este produtio já está cadastrado!');
    }

    await database.run(
      'INSERT INTO products (name, quantity, color, price, brand) VALUES (?, ?, ?, ?, ?)',
      [name, quantity, color, price, brand]
    );

    return response.status(201).json();
  }

  async update(request, response) {
    const { name, quantity, color, price, brand } = request.body;
    const { id } = request.params;

    try {
      const database = await sqliteConnection();
      const product = await database.get(
        'SELECT * FROM products WHERE id = ?',
        [id]
      );

      if (!product) {
        throw new AppError('Produto não encontrado.');
      }

      const productWithUpdatedNameAndColor = await database.get(
        'SELECT * FROM products WHERE name = ? AND color = ?',
        [name, color]
      );

      if (
        productWithUpdatedNameAndColor &&
        productWithUpdatedNameAndColor.id !== product.id
      ) {
        throw new AppError('Este produto já existe.');
      }

      product.name = name ?? user.name;
      product.quantity = quantity ?? user.quantity;
      product.color = color ?? user.color;
      product.price = price ?? user.price;
      product.brand = brand ?? user.brand;

      await database.run(
        `
        UPDATE products SET
        name = ?,
        quantity = ?,
        color = ?,
        price = ?,
        brand = ?
        WHERE id = ?`,
        [
          product.name,
          product.quantity,
          product.color,
          product.price,
          product.brand,
          id,
        ]
      );

      return response.status(200).json();
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }

  async delete(request, response) {
    const { id } = request.params;

    try {
      const database = await sqliteConnection();

      const deleteProduct = await database.get(
        'SELECT * FROM products WHERE id = ?',
        [id]
      );

      if (!deleteProduct) {
        throw new AppError('Produto não encontrado.');
      }

      await database.run('DELETE FROM products WHERE id = ?', [id]);

      return response.status(200).json();
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }

  async index(request, response) {
    try {
      const database = await sqliteConnection();

      const products = await database.all('SELECT * FROM products');

      return response.status(200).json(products);
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }
}

module.exports = ProductsController;
