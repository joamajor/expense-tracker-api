import { Expense } from './expense.entity';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  expenses: Expense[];
};

export type PublicUser = Omit<User, 'password'>;

export type CreateUserPayload = Omit<User, 'id' | 'expenses'>;
export type LoginUserPayload = Pick<User, 'email' | 'password'>;
export type UpdateuserPayload = Omit<
  User,
  'id' | 'email' | 'password' | 'expenses'
>;
