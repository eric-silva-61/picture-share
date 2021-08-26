const route = require('color-convert/route');
const express = require('express');
const router = express.Router();

const controllers = require('../controllers/places-controllers');

router.get('/user/:id', controllers.getUserPlaces);

router.get('/:id', controllers.getPlaceById);

module.exports = router;
