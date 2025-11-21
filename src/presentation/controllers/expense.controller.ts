import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../domain/error';
import { ExpenseUpdateDto, ExpenseCreateDto } from '../../domain/dtos';
import {
  ExpenseDatasourceInterface,
  UserDatasourceInterface,
} from '../../domain/datasources';
import {
  CreateExpense,
  FindExpense,
  FindExpenses,
  UpdateExpense,
  DeleteExpense,
} from '../../use-cases';

export class ExpenseController {
  constructor(
    private readonly userDatasource: UserDatasourceInterface,
    private readonly expenseDatasource: ExpenseDatasourceInterface
  ) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.body;

    const findExpenses = new FindExpenses(this.expenseDatasource);

    findExpenses
      .execute({ userId: user.id })
      .then((resp) => {
        res.status(200).json({
          success: true,
          data: resp,
        });
      })
      .catch(next);
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.body;
    const { id } = req.params;

    const findExpense = new FindExpense(this.expenseDatasource);

    findExpense
      .execute({ expenseId: id, userId: user.id })
      .then((resp) => {
        res.status(200).json({
          success: true,
          data: resp,
        });
      })
      .catch(next);
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.body;

    const [error, data] = ExpenseCreateDto.validate({
      userId: user.id,
      ...req.body,
    });

    if (error) {
      throw AppError.badRequest(error);
    }

    const createExpense = new CreateExpense(
      this.userDatasource,
      this.expenseDatasource
    );

    createExpense
      .execute({ userId: user.id, payload: data! })
      .then((resp) => {
        res.status(201).json({
          success: true,
          data: resp,
        });
      })
      .catch(next);
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    const { id: expenseId } = req.params;
    const { user } = req.body;

    const [error, data] = ExpenseUpdateDto.validate(req.body);

    if (error) {
      throw AppError.badRequest(error);
    }

    const updateExpense = new UpdateExpense(this.expenseDatasource);

    updateExpense
      .execute({ expenseId, userId: user.id, payload: data! })
      .then((resp) => {
        res.status(200).json({
          success: true,
          data: resp,
        });
      })
      .catch(next);
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    const { id: expenseId } = req.params;
    const { user } = req.body;

    const deleteExpense = new DeleteExpense(
      this.userDatasource,
      this.expenseDatasource
    );

    deleteExpense
      .execute({ expenseId, userId: user.id })
      .then(() => {
        res.status(200).json({
          success: true,
          data: { message: 'Expense deleted successfully.' },
        });
      })
      .catch(next);
  };
}
