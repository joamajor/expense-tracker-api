import { Router } from 'express';
import { AuthRouter } from './auth.router';
import { ErrorMiddleware } from '../middlewares/error.midleware';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { ExpenseRouter } from './expense.routes';
import { UserRouter } from './user.routes';

export class ApiRouter {
  static get routes(): Router {
    const router = Router();

    router.get('/', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'Server is running',
      });
    });

    router.use('/auth', AuthRouter.routes);
    // router.use('/users', AuthMiddleware.ensureAuth, UserRouter.routes);
    router.use('/expenses', AuthMiddleware.ensureAuth, ExpenseRouter.routes);

    router.use(ErrorMiddleware.handleError);

    return router;
  }
}
