import { ExpenseDatasourceInterface } from '../../domain/datasources';
import { Expense } from '../../domain/entities';

interface UseCaseInput {
  userId: string;
}

interface UseCaseOutput {
  expenses: Expense[];
}

export class FindExpenses {
  constructor(private readonly expenseDatasource: ExpenseDatasourceInterface) {}

  async execute(input: UseCaseInput): Promise<UseCaseOutput> {
    const { userId } = input;

    const expenses = await this.expenseDatasource.findAll(userId);

    return {
      expenses,
    };
  }
}
