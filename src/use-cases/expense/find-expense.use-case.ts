import { ExpenseDatasourceInterface } from '../../domain/datasources';
import { Expense } from '../../domain/entities';
import { AppError } from '../../domain/error';

interface UseCaseInput {
  expenseId: string;
  userId: string;
}

interface UseCaseOutput {
  expense: Expense;
}

export class FindExpense {
  constructor(private readonly expenseDatasource: ExpenseDatasourceInterface) {}

  async execute(input: UseCaseInput): Promise<UseCaseOutput> {
    const { expenseId, userId } = input;

    const expense = await this.expenseDatasource.findById(expenseId);

    if (!expense) {
      throw AppError.notFound('Expense not found.');
    }

    if (expense.user !== userId) {
      throw AppError.notAllowed(
        'You do not have permission to view this expense.'
      );
    }

    return {
      expense,
    };
  }
}
