const express = require('express');
const HttpError = require('./models/http-error');
//const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');

const app = express();

app.use(express.json());

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

app.listen(5000);
