import { Category } from '../entities';

export class ExpenseCreateDto {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly amount: number,
    public readonly paymentDate: Date,
    public readonly category: Category,
    public readonly user: string
  ) {}

  static validate(body: { [jey: string]: any }): [string, ExpenseCreateDto?] {
    const { name, description, amount, paymentDate, category, user } = body;

    if (!name) return ['Expense name is required.'];
    if (!amount) return ['Expense amount is required.'];
    if (amount <= 0) return ['Invalid expense amount.'];
    if (!Object.values(Category).includes(category))
      return ['Invalid expense category.'];
    if (!user) return ['User ID is required.'];

    return [
      '',
      new ExpenseCreateDto(
        name,
        description,
        amount,
        paymentDate,
        category,
        user
      ),
    ];
  }
}
