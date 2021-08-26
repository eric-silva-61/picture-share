const HttpError = require('../models/http-error');

const DUMMY_PLACES = [
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
    creator: 'u1'
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
  const places = DUMMY_PLACES.find((p) => p.creator === userId);

  if (!places) {
    return next(new HttpError('Could not find places for user', 404));
  }

  res.json({ places });
};

exports.getPlaceById = getPlaceById;
exports.getUserPlaces = getUserPlaces;
