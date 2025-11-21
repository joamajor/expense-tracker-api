export enum Category {
  GROCERIES = 'Groceries',
  LEISURES = 'Leisures',
  UTILITIES = 'Utilities',
  CLOTHING = 'Clothing',
  HEALTH = 'Health',
  OTHERS = 'Others',
}

export type Expense = {
  id: string;
  name: string;
  description: string;
  amount: number;
  paymentDate: Date;
  category: Category;
  user: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateExpensePayload = Omit<
  Expense,
  'id' | 'createdAt' | 'updatedAt'
>;

export type UpdateExpensePayload = Omit<
  Expense,
  'id' | 'user' | 'createdAt' | 'updatedAt'
>;
