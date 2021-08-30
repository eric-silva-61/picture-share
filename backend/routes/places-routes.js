const { Router } = require('express');
const { check } = require('express-validator');

const controllers = require('../controllers/places-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const router = Router();

router.get('/user/:id', controllers.getUserPlaces);
router.get('/:id', controllers.getPlaceById);

router.use(checkAuth);

router.post(
  '/',
  fileUpload.single('image'),
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address').not().isEmpty()
  ],
  controllers.createPlace
);

router.patch(
  '/:id',
  [check('title').not().isEmpty(), check('description').isLength({ min: 5 })],
  controllers.updatePlace
);

router.delete('/:id', controllers.deletePlace);

module.exports = router;
