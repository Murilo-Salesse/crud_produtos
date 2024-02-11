const { Router } = require('express');

const productsRouter = require('./products.routes');

const routes = Router();
routes.use('/', productsRouter);

module.exports = routes;
