import { Schema, Types, model } from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

const answerSchema = new Schema({
  questionId: { type: String, ref: 'Quiz', required: true },
  category: { type: String, required: true },
  title: { type: String, required: true },
  answeredOn: { type: Date, default: Date.now },
});

const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'Firstname is required.'],
    minLength: [3, 'Firstname should be at least 3 characters long.']
  },
  lastName: {
    type: String,
    required: [true, 'Lastname is required.'],
    minLength: [3, 'Lastname should be at least 3 characters long.']
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true
  },
  score: { 
    type: Number,
    default: 0
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])(.{8,})$/,
      'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    ],
  },
  answers: [answerSchema],
  comments: [{ type: Types.ObjectId, ref: 'Planet' }],
  role: { 
    type: String, 
    enum: ['admin', 'user'],
    default: 'user'
  },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function () {
  const hash = await bcrypt.hash(this.password, SALT_ROUNDS);
  this.password = hash;
});

const User = model('User', userSchema);

export default User;
