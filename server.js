require('dotenv').config({ path: '../config.env' });
const connectDB = require('./database/db');
const app = require('./app');

connectDB();

const port = process.env.PORT;
const host = process.env.HOST;

app.listen(port, host, () => console.log(`http://${host}:${port}`));
