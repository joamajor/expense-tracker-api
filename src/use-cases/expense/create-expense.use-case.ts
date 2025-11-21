import {
  ExpenseDatasourceInterface,
  UserDatasourceInterface,
} from '../../domain/datasources';
import { CreateExpensePayload, Expense } from '../../domain/entities';
import { AppError } from '../../domain/error';

interface UseCaseInput {
  userId: string;
  payload: CreateExpensePayload;
}

interface UseCaseOutput {
  expense: Expense;
}

export class CreateExpense {
  constructor(
    private readonly userDatasource: UserDatasourceInterface,
    private readonly expenseDatasource: ExpenseDatasourceInterface
  ) {}

  async execute(input: UseCaseInput): Promise<UseCaseOutput> {
    const { payload, userId } = input;

    const expense = await this.expenseDatasource.create({
      ...payload,
      user: userId,
    });

    if (!expense) {
      throw AppError.internal('We were unable to create the expense.');
    }

    this.userDatasource.addUserExpense(userId, expense.id);

    return {
      expense,
    };
  }
}
