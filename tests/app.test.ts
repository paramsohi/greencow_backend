import request from 'supertest';
import { app } from '../src/app';

describe('App health', () => {
  it('should return healthy response', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('ok');
  });

  it('should return 404 for unknown route', async () => {
    const response = await request(app).get('/api/not-found');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it('should match phone OTP request route under /api/auth', async () => {
    const response = await request(app).post('/api/auth/phone/request-otp').send({});

    expect(response.status).not.toBe(404);
    expect(response.body.success).toBe(false);
  });
});
