import { Schema, Types, model } from 'mongoose';

const planetSchema = new Schema({
  name: {
    type: String,
    minLenght: [3, 'Planet name should be at least 3 characters long.'],
    required: [true, 'Planet name is required.'],
  },
  type: {
    type: String,
    required: [true, 'Planet type is required.'],
    enum: {
      values: ['Star', 'Planet'],
      message: 'Planet type must be one of: Star, Planet',
    },
  },
  image: {
    type: String,
    required: [true, 'Image URL is required.'],
    match: [
      /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i,
      'Planet image must be a valid URL ending with .jpg, .jpeg, .png, .gif, .webp, or .svg',
    ],
  },
  distanceToSun: {
    type: String,
    required: [true, 'Planet distance to Sun is required.'],
  },
  size: {
    type: String,
    required: [true, 'Planet size is required.'],
  },
  description: {
    type: String,
    minLenght: [10, 'Planet description should be at least 10 characters long.'],
    required: [true, 'Planet description is required.'],
  },
  order: {
    type: Number,
    required: [true, 'Planet order is required.'],
  },
  comments: [
    {
      _id: { type: Types.ObjectId, default: () => new Types.ObjectId() },
      user: { type: Types.ObjectId, ref: 'User' },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    }
  ],
  ownerId: { type: Types.ObjectId, ref: 'User' },
});

planetSchema.index({ order: 1 });

const Planets = model('Planets', planetSchema);

export default Planets;