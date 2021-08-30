const HttpError = require('../models/http-error');

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

  const newUser = new User({
    name,
    email,
    password,
    imageUrl: req.file.path.replace(/\\/g, '/'),
    places: []
  });

  try {
    await newUser.save();
  } catch (error) {
    return next(new HttpError(`Failed to create user (${error.message})`, 500));
  }

  res.status(201).json({
    message: 'user created',
    user: newUser.toObject({ getters: true })
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let user;

  try {
    user = await User.findOne({ email: email });
  } catch (error) {
    return next(new HttpError('Invalid user', 500));
  }

  if (user.password !== password) {
    return next(new HttpError('Incorrect password', 401));
  }
  res.status(200).json({
    message: 'Logged in',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl
    }
  });
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;
