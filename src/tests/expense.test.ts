import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ExpenseModel, UserModel } from '../infraestructure/database/models';
import request from 'supertest';
import app from '../presentation/app';

let token = '';
let userId = '';
let expenseId = '';

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/expense_tracker_test');

  const user = await UserModel.create({
    firstName: 'User',
    lastName: 'Test',
    email: 'user@test.com',
    password: bcrypt.hashSync('UserTest1234'),
  });

  userId = user.id;

  const response = await request(app).post('/api/v1/auth/login').send({
    email: 'user@test.com',
    password: 'UserTest1234',
  });

  token = response.headers['set-cookie'][0].split(';')[0].split('=')[1];
});

beforeEach(async () => {
  // await ExpenseModel.deleteMany({});
});

afterAll(async () => {
  await UserModel.deleteMany({});
  await ExpenseModel.deleteMany({});
  await mongoose.connection.close();
});

describe('POST /api/v1/expenses', () => {
  it('should create a new expense', async () => {
    const response = await request(app)
      .post('/api/v1/expenses')
      .send({
        name: 'Expense 1',
        description: 'Expense description',
        amount: '200',
        category: 'Others',
      })
      .set('Cookie', [`access-token=${token}`]);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.expense).toBeDefined();

    expenseId = response.body.data.expense.id;

    const user = await UserModel.findById(userId);

    expect(user?.expenses.length).toBe(1);
  });

  it('should return a bad request error', async () => {
    const response = await request(app)
      .post('/api/v1/expenses')
      .send({
        description: 'Expense description',
        amount: '200',
        category: 'Others',
      })
      .set('Cookie', [`access-token=${token}`]);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBeDefined();
  });
});

describe('GET /api/v1/expenses', () => {
  it('should return an array with one expense', async () => {
    const response = await request(app)
      .get('/api/v1/expenses')
      .set('Cookie', [`access-token=${token}`]);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.expenses.length).toBe(1);
  });

  it('should return an array with two expense', async () => {
    await request(app)
      .post('/api/v1/expenses')
      .send({
        name: 'Expense 2',
        description: 'Expense description',
        amount: '200',
        category: 'Others',
      })
      .set('Cookie', [`access-token=${token}`]);

    const response = await request(app)
      .get('/api/v1/expenses')
      .set('Cookie', [`access-token=${token}`]);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.expenses.length).toBe(2);
  });
});

describe('GET /api/v1/expenses/:id', () => {
  it('should return expense', async () => {
    const response = await request(app)
      .get(`/api/v1/expenses/${expenseId}`)
      .set('Cookie', [`access-token=${token}`]);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.expense.id).toBe(expenseId);
  });
});

describe('PUT /api/v1/expenses/:id', () => {
  it('should return expense updated', async () => {
    const response = await request(app)
      .put(`/api/v1/expenses/${expenseId}`)
      .send({
        name: 'Expense updated',
        description: 'Expense description',
        amount: '200',
        category: 'Others',
      })
      .set('Cookie', [`access-token=${token}`]);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.expense.id).toBe(expenseId);
    expect(response.body.data.expense.name).toBe('Expense updated');
  });
});

describe('DELETE /api/v1/expenses/:id', () => {
  it('should delete expense', async () => {
    const response = await request(app)
      .delete(`/api/v1/expenses/${expenseId}`)
      .set('Cookie', [`access-token=${token}`]);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.message).toBe('Expense deleted successfully.');

    const user = await UserModel.findById(userId);

    expect(user?.expenses.length).toBe(1);
  });
});
