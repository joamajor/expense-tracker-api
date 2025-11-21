import { Router } from 'express';
import { UserDatasource } from '../../infraestructure/datasources/user.datasource';
import { UserController } from '../controllers/user.controller';

export class UserRouter {
  static get routes(): Router {
    const router = Router();

    const datasource = new UserDatasource();
    const controller = new UserController(datasource);

    return router;
  }
}
