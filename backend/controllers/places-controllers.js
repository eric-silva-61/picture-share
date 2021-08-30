const fs = require('fs');
const HttpError = require('../models/http-error');
const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');

const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');
const mongoose = require('mongoose');

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
    return next(new HttpError('Could not find place for id', 404));
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

  const { title, description, address, creator } = req.body;
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
    imageUrl: req.file.path.replace(/\\/g, '/'),
    location: coordinates,
    creator
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (error) {
    return next(
      new HttpError(`Failed to create place (${error.message})`, 500)
    );
  }

  if (!user) {
    return next(new HttpError(`Invalid user (${error.message})`, 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await newPlace.save({ session: sess });
    user.places.push(newPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
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
    updatedPlace = await Place.findById(placeId);
  } catch (error) {
    return next(
      new HttpError(`Failed to update place (${error.message})`, 500)
    );
  }
  if (updatedPlace.creator.toString() !== req.userData.userId) {
    return next(new HttpError(`Unauthorized edit (${error.message})`, 401));
  }

  updatedPlace.title = title;
  updatedPlace.description = description;

  try {
    await updatedPlace.save();
  } catch (error) {
    return next(
      new HttpError(`Failed to update place (${error.message})`, 401)
    );
  }

  res.status(200).json({ place: updatedPlace.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.id;
  let place;

  try {
    place = await Place.findById(placeId).populate('creator');

    if (!place) {
      return next(
        new HttpError(
          `Could not find place for that id (${error.message})`,
          404
        )
      );
    }

    if (place.creator.id !== req.userData.userId) {
      return next(
        new HttpError(
          `No authorized to delete this place (${error.message})`,
          401
        )
      );
    }

    const imagePath = place.imageUrl;

    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();

    fs.unlink(imagePath.replace(/\//g, '\\'), (err) => {
      if (err) {
        console.log(`Failed to delete file: ${err}`);
      }
    });
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
