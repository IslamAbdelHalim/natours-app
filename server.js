const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./models/Tour');
dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASS,
);

mongoose
  .connect(DB)
  .then(() => console.log('Connected To DataBase successful'))
  .catch((err) => console.log(err));

const newTour = new Tour({
  name: 'Islam',
});

newTour.save().then((doc) => console.log(doc));

const port = process.env.PORT;
const host = process.env.HOST;

app.listen(port, host, () => console.log(`http://${host}:${port}`));
