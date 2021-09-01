const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const likeSchema = new mongoose.Schema(
  {
    creator: { type: mongoose.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

const placeSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    imageUrl: { type: String, required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    creator: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    likes: [likeSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Place', placeSchema);
//module.exports = mongoose.model('Like')
