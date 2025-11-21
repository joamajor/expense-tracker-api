import {
  CreateExpensePayload,
  Expense,
  UpdateExpensePayload,
} from '../entities';

export interface ExpenseDatasourceInterface {
  findAll(userId: string): Promise<Expense[]>;
  findById(id: string): Promise<Expense | null>;
  create(payload: CreateExpensePayload): Promise<Expense>;
  update(id: string, payload: UpdateExpensePayload): Promise<Expense | null>;
  delete(id: string): Promise<void>;
}
