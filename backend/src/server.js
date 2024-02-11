require('express-async-errors');

const cors = require('cors');
const migrationsRun = require('./database/sqlite/migrations');
const AppError = require('./ultils/AppError');
const express = require('express');
const routes = require('./routes');

migrationsRun();

const app = express();
app.use(express.json());
app.use(cors());

app.use(routes);

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }

  console.log(error);

  return response.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

const PORT = 4444;
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
