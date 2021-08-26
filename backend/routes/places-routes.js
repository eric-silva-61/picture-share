const { Router } = require('express');
const { check } = require('express-validator');

const controllers = require('../controllers/places-controllers');

const router = Router();

router.get('/user/:id', controllers.getUserPlaces);
router.get('/:id', controllers.getPlaceById);
router.delete('/:id', controllers.deletePlace);
router.patch(
  '/:id',
  [check('title').not().isEmpty(), check('description').isLength({ min: 5 })],
  controllers.updatePlace
);
router.post(
  '/',
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address').not().isEmpty()
  ],
  controllers.createPlace
);

module.exports = router;
