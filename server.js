require('dotenv').config({ path: '../config.env' });
const connectDB = require('./database/db');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./app');

connectDB();

const port = process.env.PORT;
const host = process.env.HOST;

const server = app.listen(port, host, () =>
  console.log(`http://${host}:${port}`),
);

// if any rejection happen from promise as connect to database sent reject
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  // close the server
  server.close(() => {
    // close the application
    process.exit(1);
  });
});
