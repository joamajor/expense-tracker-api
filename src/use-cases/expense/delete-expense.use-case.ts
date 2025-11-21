import {
  ExpenseDatasourceInterface,
  UserDatasourceInterface,
} from '../../domain/datasources';
import { AppError } from '../../domain/error';

interface UseCaseInput {
  expenseId: string;
  userId: string;
}

export class DeleteExpense {
  constructor(
    private readonly userDatasource: UserDatasourceInterface,
    private readonly expenseDatasource: ExpenseDatasourceInterface
  ) {}

  async execute(input: UseCaseInput): Promise<void> {
    const { expenseId, userId } = input;

    const expense = await this.expenseDatasource.findById(expenseId);

    if (!expense) {
      throw AppError.notFound('Expense not found.');
    }

    if (expense.user !== userId) {
      throw AppError.notAllowed(
        'You do not have permission to delete this expense.'
      );
    }

    await this.expenseDatasource.delete(expenseId);

    await this.userDatasource.deleteUserExpense(userId, expense.id);
  }
}
