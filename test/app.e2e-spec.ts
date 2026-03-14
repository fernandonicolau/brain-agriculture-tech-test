import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { setupApplication } from '../src/common/setup-app';

describe('Health (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApplication(app);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/api/v1/health (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/api/v1/health').expect(200);

    expect(response.body.status).toBe('ok');
    expect(response.body.service).toBe('brain-agriculture-api');
    expect(response.body.environment).toBe('test');
    expect(new Date(response.body.timestamp).toISOString()).toBe(response.body.timestamp);
  });

  it('/api/v1/health/live (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/api/v1/health/live').expect(200);

    expect(response.body.status).toBe('ok');
    expect(response.body.environment).toBe('test');
  });
});
