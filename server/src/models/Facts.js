import { Schema, model, Types } from 'mongoose';

const dayFactsSchema = new Schema({
  date: {
    type: String,
    match: [
      /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])$/,
      'Fact date must be in format dd.mm, e.g. 01.12',
    ],
    required: [true, 'Fact date is required, and should be at this format: dd.mm / 01.12'],
  },
  year: {
    type: Number,
    min: [0, 'Fact year must be a positive number.'],
    required: [true, 'Fact year is required.'],
  },
  title: {
    type: String,
    minLength: [5, 'Fact title should be at least 5 characters long.'],
    required: [true, 'Fact title is required.'],
  },
  description: {
    type: String,
    minLength: [10, 'Fact description should be at least 10 characters long.'],
    required: [true, 'Fact description is required.'],
  },
  ownerId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

dayFactsSchema.index({ date: 1 });

const Facts = model('Facts', dayFactsSchema);

export default Facts;
