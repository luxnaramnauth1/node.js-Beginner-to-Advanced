const mongoose = require('mongoose');

const CUISINES = [
  'italian',
  'japanese',
  'indian',
  'mexican',
  'chinese',
  'mauritian',
  'french',
  'other',
];

const hoursSchema = new mongoose.Schema(
  {
    open: { type: String, match: /^([01]\d|2[0-3]):[0-5]\d$/, required: true },
    close: { type: String, match: /^([01]\d|2[0-3]):[0-5]\d$/, required: true },
  },
  { _id: false }
);

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    cuisine: {
      type: String,
      required: [true, 'Cuisine is required'],
      lowercase: true,
      trim: true,
      enum: { values: CUISINES, message: 'Unsupported cuisine: {VALUE}' },
    },
    address: {
      street: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
    },
    phone: { type: String, trim: true },
    priceRange: { type: Number, min: 1, max: 4, default: 2 },
    hours: {
      monday: hoursSchema,
      tuesday: hoursSchema,
      wednesday: hoursSchema,
      thursday: hoursSchema,
      friday: hoursSchema,
      saturday: hoursSchema,
      sunday: hoursSchema,
    },
  },
  { timestamps: true }
);

restaurantSchema.index({ cuisine: 1, name: 1 });

module.exports = mongoose.model('Restaurant', restaurantSchema);
module.exports.CUISINES = CUISINES;
