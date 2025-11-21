import { Schema, model } from 'mongoose';
import { User } from '../../../domain/entities';

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  expenses: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Expense',
    },
  ],
});

export const UserModel = model('User', UserSchema);
