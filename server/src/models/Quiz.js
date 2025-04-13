import { Schema, model, Types } from 'mongoose';

const quizSchema = new Schema({
  ownerId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Quiz title is required.'],
    minlength: [5, 'Quiz title must be at least 5 characters long.'],
  },
  category: {
    type: String,
    enum: {
      values: ['Cadet', 'Pilot', 'Commander', 'Admiral'],
      message: 'Category must be one of: cadet, pilot, commander, or admiral.',
    },
    required: [true, 'Please select a category.'],
  },
  options: {
    type: [String],
    validate: {
      validator: function (v) {
        return Array.isArray(v) && v.length >= 2;
      },
      message: 'There must be at least two answer options.',
    },
    required: [true, 'Answer options are required.'],
  },
  correctAnswer: {
    type: String,
    required: [true, 'Please provide the correct answer.'],
    validate: {
      validator: function (v) {
        return this.options && this.options.includes(v);
      },
      message: 'The correct answer must be one of the provided options.',
    },
  }
},
{
  timestamps: true,
});

quizSchema.index({ category: 1});

const Quiz = model('Quiz', quizSchema, 'questions');

export default Quiz;
