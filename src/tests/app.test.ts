import request from 'supertest';
import app from '../presentation/app';

describe('App tests', () => {
  it('GET / should responds with status 200 ', async () => {
    const response = await request(app).get('/api/v1');
    expect(response.status).toBe(200);
  });
});
