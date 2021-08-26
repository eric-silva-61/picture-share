const express = require('express');
const router = express.Router();

const controllers = require('../controllers/places-controllers');

router.get('/user/:id', controllers.getUserPlaces);
router.get('/:id', controllers.getPlaceById);
router.patch('/:id', controllers.updatePlace);
router.delete('/:id', controllers.deletePlace);
router.post('/', controllers.createPlace);

module.exports = router;
