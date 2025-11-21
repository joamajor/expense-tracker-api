import { Router } from 'express';
import { ExpenseDatasource } from '../../infraestructure/datasources/expense.datasource';
import { ExpenseController } from '../controllers/expense.controller';
import { UserDatasource } from '../../infraestructure/datasources';

export class ExpenseRouter {
  static get routes(): Router {
    const router = Router();

    const userDatasource = new UserDatasource();
    const expenseDatasource = new ExpenseDatasource();
    const controller = new ExpenseController(userDatasource, expenseDatasource);

    router.post('/', controller.create);
    router.get('/', controller.getAll);
    router.get('/:id', controller.getById);
    router.put('/:id', controller.update);
    router.delete('/:id', controller.delete);

    return router;
  }
}
