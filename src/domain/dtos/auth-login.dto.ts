export class AuthLoginDto {
  constructor(
    public readonly email: string,
    public readonly password: string
  ) {}

  static validate(body: { [jey: string]: any }): [string, AuthLoginDto?] {
    const { email, password } = body;

    if (!email) return ['User email is required'];
    if (!password) return ['User password is required'];

    return ['', new AuthLoginDto(email, password)];
  }
}
