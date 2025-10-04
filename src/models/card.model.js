const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    phone: {
      type: String,
      required: true,
      match: /^0\d{1,2}-?\d{7}$/ // Israeli phone format
    },
    email: {
      type: String,
      required: true,
      match: /^\S+@\S+\.\S+$/
    },
    web: {
      type: String,
      match: /^https?:\/\/.+/
    },
    image: {
      url: {
        type: String,
        default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
      },
      alt: { type: String, default: 'business card image' }
    },
    address: {
      country: { type: String, required: true },
      city: { type: String, required: true },
      street: { type: String, required: true },
      houseNumber: { type: Number, required: true },
      zip: { type: String }
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bizNumber: {
      type: Number,
      required: true,
      unique: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Card', cardSchema);
