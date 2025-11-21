import { UserDatasourceInterface } from '../../domain/datasources/user.datasource';
import { LoginUserPayload, PublicUser } from '../../domain/entities';
import { AppError } from '../../domain/error';

type ComparePassword = (password: string, hash: string) => Promise<boolean>;
type SignToken = (payload: { id: string; email: string }) => Promise<string>;

interface UseCaseInput {
  payload: LoginUserPayload;
}

interface UseCaseOutput {
  user: PublicUser;
  accessToken: string;
}

export class LoginUser {
  constructor(
    private readonly userDatasource: UserDatasourceInterface,
    private readonly comparePassword: ComparePassword,
    private readonly signToken: SignToken
  ) {}

  async execute(input: UseCaseInput): Promise<UseCaseOutput> {
    const {
      payload: { email, password },
    } = input;

    const user = await this.userDatasource.findByEmail(email);

    if (!user) {
      throw AppError.unauthorized('Invalid user credentials.');
    }

    const validPassword = await this.comparePassword(password, user.password);

    if (!validPassword) {
      throw AppError.unauthorized('Invalid user credentials.');
    }

    const accessToken = await this.signToken({
      id: user.id!,
      email: user.email,
    });

    const { password: _, ...publicUser } = user;

    return {
      user: publicUser,
      accessToken,
    };
  }
}
