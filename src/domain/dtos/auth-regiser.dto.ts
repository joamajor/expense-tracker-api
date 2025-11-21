export class AuthRegisterDto {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly password: string
  ) {}

  static validate(body: { [jey: string]: any }): [string, AuthRegisterDto?] {
    const { firstName, lastName, email, password } = body;

    if (!firstName) return ['User first name is required'];
    if (!lastName) return ['User last name is required'];
    if (!email) return ['User email is required'];
    if (!password) return ['User password is required'];

    return ['', new AuthRegisterDto(firstName, lastName, email, password)];
  }
}
