const express = require('express');
const router = express.Router();

const controllers = require('../controllers/users-controllers');

router.get('/', controllers.getUsers);
router.post('/signup', controllers.signUp);
router.post('/login', controllers.login);

module.exports = router;
