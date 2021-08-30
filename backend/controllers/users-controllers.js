const HttpError = require('../models/http-error');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { validationResult } = require('express-validator');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (error) {
    return next(new HttpError('Failed to get users', 500));
  }

  res
    .status(200)
    .json({ users: users.map((u) => u.toObject({ getters: true })) });
};

const signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs', 422));
  }

  const { name, email, password } = req.body;

  // check if exists
  const user = await User.findOne({ email: email });
  if (user) {
    return next(new HttpError('User already exist', 422));
  }

  let hashedPW;
  try {
    hashedPW = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(new HttpError('Could not create user please try again', 500));
  }

  const newUser = new User({
    name,
    email,
    password: hashedPW,
    imageUrl: req.file.path.replace(/\\/g, '/'),
    places: []
  });

  try {
    await newUser.save();
  } catch (error) {
    return next(new HttpError(`Failed to create user (${error.message})`, 500));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      'secret_dont_share',
      {
        expiresIn: '1h'
      }
    );
  } catch (error) {
    return next(new HttpError(`Failed to create user (${error.message})`, 500));
  }

  res.status(201).json({
    userId: newUser.id,
    email: newUser.email,
    token
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let user;

  try {
    user = await User.findOne({ email: email });
  } catch (error) {
    return next(new HttpError('Invalid user', 403));
  }

  let isValidPW = false;
  try {
    isValidPW = await bcrypt.compare(password, user.password);
  } catch (error) {
    return next(
      new HttpError(
        'Could not log you in, check credentials and try again',
        403
      )
    );
  }

  if (!isValidPW) {
    return next(new HttpError('Incorrect password', 401));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: user.id, email: user.email },
      'secret_dont_share',
      {
        expiresIn: '1h'
      }
    );
  } catch (error) {
    return next(new HttpError(`Failed to login (${error.message})`, 403));
  }

  res.status(200).json({
    userId: user.id,
    email: user.email,
    token
  });
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;
