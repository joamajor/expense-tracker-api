import { CreateUserPayload, UpdateuserPayload, User } from '../entities';

export interface UserDatasourceInterface {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(payload: CreateUserPayload): Promise<User>;
  update(id: string, payload: UpdateuserPayload): Promise<User | null>;
  delete(id: string): Promise<void>;
  addUserExpense(id: string, expenseId: string): Promise<void>;
  deleteUserExpense(id: string, expenseId: string): Promise<void>;
}
