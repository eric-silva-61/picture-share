const express = require('express');
const mongoose = require('mongoose');
//const bodyParser = require('body-parser');

const HttpError = require('./models/http-error');
const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

// catch all for bad routes
app.use((req, res, next) => {
  throw new HttpError('Route does not exist', 404);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({
    message: error.message || 'Unknown error occurred'
  });
});

mongoose
  .connect(
    'mongodb+srv://ericlsilva:s2XvMugTDB3TaWs@cluster0.xdrlc.mongodb.net/place-share?retryWrites=true&w=majority',
    { useNewUrlParser: true }
  )
  .then((foo) => {
    console.log('DATABASE CONNECTED');
    app.listen(5000);
  })
  .catch(() => {
    console.log('DATABASE CONNECTION FAILED');
  });
