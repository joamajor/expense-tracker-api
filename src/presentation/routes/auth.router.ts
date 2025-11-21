import { Router } from 'express';
import { UserDatasource } from '../../infraestructure/datasources/user.datasource';
import { AuthController } from '../controllers/auth.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class AuthRouter {
  static get routes(): Router {
    const router = Router();

    const userDatasource = new UserDatasource();
    const authController = new AuthController(userDatasource);

    router.post('/register', authController.register);
    router.post('/login', authController.login);
    router.get(
      '/profile',
      AuthMiddleware.ensureAuth,
      authController.getProfile
    );

    return router;
  }
}
