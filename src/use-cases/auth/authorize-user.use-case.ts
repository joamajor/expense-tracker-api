import { UserDatasourceInterface } from '../../domain/datasources/user.datasource';
import { PublicUser } from '../../domain/entities';
import { AppError } from '../../domain/error';

type VerifyToken = (token: string) => Promise<{ id: string; email: string }>;

export class AuthorizeUser {
  constructor(
    private readonly userDatasource: UserDatasourceInterface,
    private readonly verifyToken: VerifyToken
  ) {}

  async execute({ token }: { token: string }): Promise<{ user: PublicUser }> {
    const { id } = await this.verifyToken(token);

    const user = await this.userDatasource.findById(id);

    if (!user) {
      throw AppError.unauthorized('Unauthorized. User not found.');
    }

    const { password: _, ...publicUser } = user;

    return {
      user: publicUser,
    };
  }
}
