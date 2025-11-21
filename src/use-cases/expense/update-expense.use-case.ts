import { ExpenseDatasourceInterface } from '../../domain/datasources';
import { Expense, UpdateExpensePayload } from '../../domain/entities';
import { AppError } from '../../domain/error';

interface UseCaseInput {
  userId: string;
  expenseId: string;
  payload: UpdateExpensePayload;
}

interface UseCaseOutput {
  expense: Expense;
}

export class UpdateExpense {
  constructor(private readonly expenseDatasource: ExpenseDatasourceInterface) {}

  async execute(input: UseCaseInput): Promise<UseCaseOutput> {
    const { userId, expenseId, payload } = input;

    const expense = await this.expenseDatasource.findById(expenseId);

    if (!expense) {
      throw AppError.notFound('Expense not found.');
    }

    if (expense.user !== userId) {
      throw AppError.notAllowed('You are not allowed to see this expense.');
    }

    const expenseUpdated = await this.expenseDatasource.update(
      expenseId,
      payload
    );

    if (!expenseUpdated) {
      throw AppError.internal('We were unable to update your expense.');
    }

    return {
      expense: expenseUpdated,
    };
  }
}
