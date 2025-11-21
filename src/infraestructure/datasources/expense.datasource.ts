import { ExpenseDatasourceInterface } from '../../domain/datasources';
import {
  CreateExpensePayload,
  Expense,
  UpdateExpensePayload,
} from '../../domain/entities';
import { ExpenseModel } from '../database/models';

export class ExpenseDatasource implements ExpenseDatasourceInterface {
  private mapExpense(object: { [key: string]: any }): Expense {
    return {
      id: object.id,
      name: object.name,
      description: object.description,
      amount: object.amount,
      paymentDate: object.paymentDate,
      category: object.category,
      user: object.user.toString(),
      createdAt: object.createdAt,
      updatedAt: object.updatedAt,
    };
  }

  async findAll(userId: string): Promise<Expense[]> {
    const expenses = await ExpenseModel.find({ user: userId });
    return expenses.map(this.mapExpense);
  }

  async findById(id: string): Promise<Expense | null> {
    const expense = await ExpenseModel.findById(id);
    return expense ? this.mapExpense(expense) : null;
  }

  async create(payload: CreateExpensePayload): Promise<Expense> {
    const newExpense = await ExpenseModel.create(payload);
    return this.mapExpense(newExpense);
  }

  async update(
    id: string,
    payload: UpdateExpensePayload
  ): Promise<Expense | null> {
    const updatedExpense = await ExpenseModel.findByIdAndUpdate(id, payload, {
      new: true,
    });
    return updatedExpense ? this.mapExpense(updatedExpense) : null;
  }

  async delete(id: string): Promise<void> {
    await ExpenseModel.findByIdAndDelete(id);
  }
}
