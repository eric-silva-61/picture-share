const HttpError = require('../models/http-error');
const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');

const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');

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

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.id;
  let place;

  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(
      new HttpError(`Failed to get place with that id (${error.message})`, 500)
    );
  }

  if (!place) {
    throw new HttpError('Could not find place for id', 404);
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getUserPlaces = async (req, res, next) => {
  const userId = req.params.id;
  let places;

  try {
    places = await Place.find({ creator: userId });
  } catch (error) {
    return next(
      new HttpError(
        `Failed to get place for that user id (${error.message})`,
        500
      )
    );
  }

  if (!places || places.length === 0) {
    return next(new HttpError('Could not find places for user', 404));
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true }))
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs', 422));
  }

  const { title, description, address, imageUrl, creator } = req.body;
  let coordinates;

  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const newPlace = new Place({
    title,
    description,
    address,
    imageUrl,
    location: coordinates,
    creator
  });
  try {
    await newPlace.save();
  } catch (error) {
    return next(
      new HttpError(`Failed to create place (${error.message})`, 500)
    );
  }
  res.status(201).json({ place: newPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs', 422));
  }

  const placeId = req.params.id;
  const { title, description } = req.body;
  let updatedPlace;

  try {
    updatedPlace = await Place.findOneAndUpdate(
      { _id: placeId },
      {
        title,
        description
      },
      { new: true }
    );
  } catch (error) {
    return next(
      new HttpError(`Failed to update place (${error.message})`, 500)
    );
  }
  res.status(200).json({ place: updatedPlace.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.id;

  try {
    await Place.findOneAndDelete({ _id: placeId });
  } catch (error) {
    return next(
      new HttpError(`Failed to delete place (${error.message})`, 500)
    );
  }

  res.status(200).json({ message: 'Place deleted' });
};

exports.getPlaceById = getPlaceById;
exports.getUserPlaces = getUserPlaces;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
