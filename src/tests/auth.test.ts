import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserModel } from '../infraestructure/database/models';
import request from 'supertest';
import app from '../presentation/app';

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/expense_tracker_test');
});

beforeEach(async () => {
  await UserModel.deleteMany({});
});

afterAll(async () => {
  await UserModel.deleteMany({});
  await mongoose.connection.close();
});

describe('POST /api/v1/auth/register', () => {
  it('should register a new user', async () => {
    const response = await request(app).post('/api/v1/auth/register').send({
      firstName: 'User',
      lastName: 'Test',
      email: 'user@test.com',
      password: 'UserTest1234',
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.message).toBeDefined();
  });

  it('should return an error if user already exists', async () => {
    await UserModel.create({
      firstName: 'User',
      lastName: 'Test',
      email: 'user@test.com',
      password: 'UserTest1234',
    });

    const response = await request(app).post('/api/v1/auth/register').send({
      firstName: 'User',
      lastName: 'Test',
      email: 'user@test.com',
      password: 'UserTest1234',
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toBe('User already exists.');
  });
});

describe('POST /api/v1/auth/login', () => {
  it('should login a user', async () => {
    await UserModel.create({
      firstName: 'User',
      lastName: 'Test',
      email: 'user@test.com',
      password: bcrypt.hashSync('UserTest1234'),
    });

    const response = await request(app).post('/api/v1/auth/login').send({
      email: 'user@test.com',
      password: 'UserTest1234',
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.user).toBeDefined();
    expect(response.body.data.user.email).toBe('user@test.com');

    expect(Object.keys(response.headers)).toContain('set-cookie');
    expect(response.headers['set-cookie'][0]).toContain('access-token');

    // const cookie = response.headers['set-cookie'][0]
    //   .split(';')[0]
    //   .split('=')[1];
  });

  it('should return an error for invalid email', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({
      email: 'user@test.com',
      password: 'UserTest1234',
    });

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBeDefined();
    expect(response.body.error.message).toBe('Invalid user credentials.');
  });

  it('should return an error for invalid password', async () => {
    await UserModel.create({
      firstName: 'User',
      lastName: 'Test',
      email: 'user@test.com',
      password: bcrypt.hashSync('UserTest1234'),
    });

    const response = await request(app).post('/api/v1/auth/login').send({
      email: 'user@test.com',
      password: 'wrong-password',
    });

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBeDefined();
    expect(response.body.error.message).toBe('Invalid user credentials.');
  });
});

describe('GET /api/v1/auth/profile', () => {
  it('should return the logged user', async () => {
    await UserModel.create({
      firstName: 'User',
      lastName: 'Test',
      email: 'user@test.com',
      password: bcrypt.hashSync('UserTest1234'),
    });

    const loginResp = await request(app).post('/api/v1/auth/login').send({
      email: 'user@test.com',
      password: 'UserTest1234',
    });

    expect(Object.keys(loginResp.headers)).toContain('set-cookie');
    expect(loginResp.headers['set-cookie'][0]).toContain('access-token');

    const token = loginResp.headers['set-cookie'][0]
      .split(';')[0]
      .split('=')[1];

    const response = await request(app)
      .get('/api/v1/auth/profile')
      .set('Cookie', [`access-token=${token}`]);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should return unauthorized error', async () => {
    await UserModel.create({
      firstName: 'User',
      lastName: 'Test',
      email: 'user@test.com',
      password: bcrypt.hashSync('UserTest1234'),
    });

    const loginResp = await request(app).post('/api/v1/auth/login').send({
      email: 'user@test.com',
      password: 'UserTest1234',
    });

    const response = await request(app).get('/api/v1/auth/profile');

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBeDefined();
    expect(response.body.error.message).toBe(
      'Unauthorized. Token not provided.'
    );
  });
});
