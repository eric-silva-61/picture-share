const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    imageUrl: { type: String, required: true },
    places: [{ type: mongoose.Types.ObjectId, ref: 'Place', required: true }]
  },
  { timestamps: true }
);

//TODO: unique validator
module.exports = mongoose.model('User', userSchema);
