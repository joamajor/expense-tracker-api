import { UserDatasourceInterface } from '../../domain/datasources';
import {
  CreateUserPayload,
  Expense,
  UpdateuserPayload,
  User,
} from '../../domain/entities';
import { UserModel } from '../database/models';

export class UserDatasource implements UserDatasourceInterface {
  private mapUser(object: { [key: string]: any }): User {
    return {
      id: object.id,
      firstName: object.firstName,
      lastName: object.lastName,
      email: object.email,
      password: object.password,
      expenses: object.expenses,
    };
  }

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id);
    return user ? this.mapUser(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email });
    return user ? this.mapUser(user) : null;
  }

  async create(payload: CreateUserPayload): Promise<User> {
    const newUser = await UserModel.create(payload);
    return this.mapUser(newUser);
  }

  async update(id: string, payload: UpdateuserPayload): Promise<User | null> {
    const userUpdated = await UserModel.findByIdAndUpdate(id, payload, {
      new: true,
    });
    return userUpdated ? this.mapUser(userUpdated) : null;
  }

  async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }

  async addUserExpense(id: string, expenseId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(id, {
      $push: { expenses: expenseId },
    });
  }

  async deleteUserExpense(id: string, expenseId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(id, {
      $pull: { expenses: expenseId },
    });
  }
}
