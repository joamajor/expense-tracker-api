import { UserDatasourceInterface } from '../../domain/datasources/user.datasource';
import { CreateUserPayload } from '../../domain/entities';
import { AppError } from '../../domain/error';

type HashPassword = (password: string) => Promise<string>;

interface UseCaseInput {
  payload: CreateUserPayload;
}

export class RegisterUser {
  constructor(
    private readonly userDatasource: UserDatasourceInterface,
    private readonly hashPassword: HashPassword
  ) {}

  async execute(input: UseCaseInput): Promise<void> {
    const {
      payload: { firstName, lastName, email, password },
    } = input;

    const user = await this.userDatasource.findByEmail(email);

    if (user) {
      throw AppError.badRequest('User already exists.');
    }

    const hash = await this.hashPassword(password);

    await this.userDatasource.create({
      firstName,
      lastName,
      email,
      password: hash,
    });
  }
}
