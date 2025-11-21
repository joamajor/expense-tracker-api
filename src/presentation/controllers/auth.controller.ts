import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../domain/error';
import { AuthRegisterDto, AuthLoginDto } from '../../domain/dtos';
import { Encrypt, Token } from '../../infraestructure/helpers';
import { envs } from '../../config/envs';
import { UserDatasourceInterface } from '../../domain/datasources';
import { LoginUser, RegisterUser } from '../../use-cases';

export class AuthController {
  constructor(private readonly userDatasource: UserDatasourceInterface) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    const [error, data] = AuthRegisterDto.validate(req.body);

    if (error) {
      return next(AppError.badRequest(error));
    }

    const registerUser = new RegisterUser(
      this.userDatasource,
      Encrypt.hashPassword
    );

    registerUser
      .execute({ payload: data! })
      .then(() => {
        res.status(201).json({
          success: true,
          data: {
            message: 'User registered successfully.',
          },
        });
      })
      .catch(next);
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    const [error, data] = AuthLoginDto.validate(req.body);

    if (error) {
      return next(AppError.badRequest(error));
    }

    const loginUser = new LoginUser(
      this.userDatasource,
      Encrypt.comparePassword,
      Token.signToken
    );

    loginUser
      .execute({ payload: data! })
      .then((resp) => {
        const { user, accessToken } = resp;
        res
          .status(200)
          .cookie('access-token', accessToken, {
            httpOnly: true,
            sameSite: envs.nodeEnv === 'prod',
          })
          .json({
            success: true,
            data: {
              user,
            },
          });
      })
      .catch(next);
  };

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req.body;

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  };
}
