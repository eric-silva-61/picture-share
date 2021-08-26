const { Router } = require('express');
const { check } = require('express-validator');

const controllers = require('../controllers/users-controllers');

const router = Router();

router.get('/', controllers.getUsers);
router.post(
  '/signup',
  [
    check('email').normalizeEmail().isEmail(),
    check('name').not().isEmpty(),
    check('password').isLength({ min: 6 })
  ],
  controllers.signUp
);
router.post('/login', controllers.login);

module.exports = router;
