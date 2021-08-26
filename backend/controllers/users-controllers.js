const HttpError = require('../models/http-error');
const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');

const DUMMY_USERS = [
  {
    id: 1,
    name: 'Joe',
    email: 'joe@test.com',
    password: '123'
  },
  {
    id: 2,
    name: 'Eric',
    email: 'eric@test.com',
    password: '123'
  },
  {
    id: 3,
    name: 'Jay',
    email: 'jay@test.com',
    password: '123'
  }
];

const getUsers = (req, res, next) => {
  const users = DUMMY_USERS.map((u) => {
    return { id: u.id, email: u.email, name: u.name };
  });
  res.status(200).json({ users });
};

const signUp = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs', 422));
  }
  const { email, password, name } = req.body;
  const user = DUMMY_USERS.find((u) => u.email === email);
  if (user) {
    return next(new HttpError('User already exist', 422));
  }
  const newUser = {
    id: uuid(),
    email,
    password,
    name
  };
  DUMMY_USERS.push(newUser);
  res.status(201).json({ message: 'user created', user: newUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const user = DUMMY_USERS.find((u) => u.email === email);
  if (!user) {
    return next(new HttpError('User does not exist', 401));
  }
  if (user.password !== password) {
    return next(new HttpError('Incorrect password', 401));
  }
  res.status(200).json({ token: uuid() });
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;
