import jwt from 'jsonwebtoken';
import { envs } from '../../config/envs';
import { AppError } from '../../domain/error';

interface Payload {
  id: string;
  email: string;
}

export class Token {
  static async signToken(payload: Payload): Promise<string> {
    return await jwt.sign(payload, envs.jwtSecret, {
      expiresIn: envs.jwtExpiresIn,
    });
  }

  static async verifyToken(token: string): Promise<Payload> {
    try {
      return jwt.verify(token, envs.jwtSecret) as Payload;
    } catch (err) {
      console.log(err);
      throw AppError.unauthorized('Unauthorized. Token expired.');
    }
  }
}
