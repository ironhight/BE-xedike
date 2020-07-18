const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routers/api/User');
const tripRouter = require('./routers/api/Trip');
const provinceRouter = require('./routers/api/Province');
const carRouter = require('./routers/api/Car');

require('dotenv').config();
const mongoUri =
  process.env.NODE_ENV === 'dev'
    ? process.env.MONGO_URI_DEV
    : process.env.MONGO_URI_PROD;

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => console.log('Connect successfully'))
  .catch(console.log);

// khoi tao server
const app = express();

const port = process.env.PORT || 5000;

app.use('/', express.static('public'));

//middleware serve static files
app.use('/uploads/avatars', express.static('./uploads/avatars'));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, fingerprint, token'
  );
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

//middleware parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// middleware router handler
app.use('/api/users', userRouter);
app.use('/api/trips', tripRouter);
app.use('/api/provinces', provinceRouter);
app.use('/api/cars', carRouter);

app.listen(port, () => {
  console.log(`Server running!!!!!!!!! ${port}`);
});
