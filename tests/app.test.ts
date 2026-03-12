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
});
