import { NextFunction, Request, Response } from 'express';
import { UserDatasourceInterface } from '../../domain/datasources';

export class UserController {
  constructor(private readonly userDatasource: UserDatasourceInterface) {}
}
