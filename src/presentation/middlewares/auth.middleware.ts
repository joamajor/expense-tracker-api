import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../domain/error';
import { Token } from '../../infraestructure/helpers/token';
import { UserDatasource } from '../../infraestructure/datasources/user.datasource';
import { AuthorizeUser } from '../../use-cases';

export class AuthMiddleware {
  static async ensureAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies['access-token'];

      if (!token) {
        throw AppError.unauthorized('Unauthorized. Token not provided.');
      }

      const userDatasource = new UserDatasource();
      const authorizeUser = new AuthorizeUser(
        userDatasource,
        Token.verifyToken
      );

      const { user } = await authorizeUser.execute({ token });

      if (!req.body) req.body = {};
      req.body.user = user;

      next();
    } catch (error) {
      next(error);
    }
  }
}
