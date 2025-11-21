import { Schema, model } from 'mongoose';
import { Category } from '../../../domain/entities';

const ExpenseSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentDate: {
      type: Date,
      default: new Date(),
    },
    category: {
      type: String,
      enum: Category,
      default: Category.OTHERS,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ExpenseModel = model('Expense', ExpenseSchema);
