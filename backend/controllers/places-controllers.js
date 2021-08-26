const HttpError = require('../models/http-error');
const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');

let DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'Classic NYC skyscraper',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/2/25/Empire_State_Building_%28New_York%29_%2845240606631%29.jpg',
    address: '20 W 34th St, New York, NY 10001',
    location: {
      lat: 40.7484405,
      lng: -73.9856644
    },
    creator: 'u1'
  },
  {
    id: 'p2',
    title: 'Chrysler Building',
    description: 'Art Deco masterpiece',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/f/f9/The_Chrysler_Building_from_the_Empire_State_Building_%286998996196%29.jpg',
    address: '405 Lexington Ave, New York, NY 10174',
    location: {
      lat: 40.7516208,
      lng: -73.975502
    },
    creator: 'u2'
  }
];

const getPlaceById = (req, res, next) => {
  const placeId = req.params.id;
  const place = DUMMY_PLACES.find((p) => p.id === placeId);

  if (!place) {
    throw new HttpError('Could not find place for id', 404);
  }

  res.json({ place });
};

const getUserPlaces = (req, res, next) => {
  const userId = req.params.id;
  const places = DUMMY_PLACES.filter((p) => p.creator === userId);

  if (!places || places.length === 0) {
    return next(new HttpError('Could not find places for user', 404));
  }

  res.json({ places });
};

const createPlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs', 422));
  }

  const { title, description, address, coordinates, creator } = req.body;
  const newPlace = {
    id: uuid(),
    title,
    description,
    address,
    location: coordinates,
    creator
  };
  DUMMY_PLACES.push(newPlace);
  //DUMMY_PLACES.unshift(newPlace);
  res.status(201).json({ place: newPlace });
};

const updatePlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs', 422));
  }

  const placeId = req.params.id;
  const { title, description } = req.body;

  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  const updatedPlace = { ...DUMMY_PLACES[placeIndex] };

  if (placeIndex === -1) {
    return next(new HttpError('No record for that id', 404));
  }

  updatedPlace.title = title;
  updatedPlace.description = description;
  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.id;
  if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
    return next(new HttpError('No place for that id', 404));
  }

  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);

  res.status(200).json({ message: 'Place deleted' });
};

exports.getPlaceById = getPlaceById;
exports.getUserPlaces = getUserPlaces;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
