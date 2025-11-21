import { Category } from '../entities';

export class ExpenseUpdateDto {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly amount: number,
    public readonly paymentDate: Date,
    public readonly category: Category
  ) {}

  static validate(body: { [jey: string]: any }): [string, ExpenseUpdateDto?] {
    const { name, description, amount, paymentDate, category } = body;

    if (!name) return ['Expense name is required.'];
    if (!amount) return ['Expense amount is required.'];
    if (amount <= 0) return ['Invalid expense amount.'];
    if (!Object.values(Category).includes(category))
      return ['Invalid expense category.'];

    return [
      '',
      new ExpenseUpdateDto(name, description, amount, paymentDate, category),
    ];
  }
}
