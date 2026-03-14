import { BadRequestException, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { setupApplication } from '../src/common/setup-app';
import { DashboardController } from '../src/modules/dashboard/dashboard.controller';
import { DashboardService } from '../src/modules/dashboard/dashboard.service';
import { FarmsController } from '../src/modules/farms/farms.controller';
import { FarmsService } from '../src/modules/farms/farms.service';
import { ProducersController } from '../src/modules/producers/producers.controller';
import { ProducersService } from '../src/modules/producers/producers.service';

describe('Main API (e2e)', () => {
  let app: INestApplication;
  let producersService: jest.Mocked<ProducersService>;
  let farmsService: jest.Mocked<FarmsService>;
  let dashboardService: jest.Mocked<DashboardService>;

  beforeEach(async () => {
    producersService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<ProducersService>;

    farmsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<FarmsService>;

    dashboardService = {
      getSummary: jest.fn(),
    } as unknown as jest.Mocked<DashboardService>;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ProducersController, FarmsController, DashboardController],
      providers: [
        {
          provide: ProducersService,
          useValue: producersService,
        },
        {
          provide: FarmsService,
          useValue: farmsService,
        },
        {
          provide: DashboardService,
          useValue: dashboardService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApplication(app);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /api/v1/producers creates a producer', async () => {
    producersService.create.mockResolvedValue({
      id: '4d8b92d1-42a2-48a4-92f0-c20985060f54',
      document: '52998224725',
      name: 'Maria da Silva',
      createdAt: '2026-03-14T18:45:00.000Z',
      updatedAt: '2026-03-14T18:45:00.000Z',
    });

    const response = await request(app.getHttpServer()).post('/api/v1/producers').send({
      document: '529.982.247-25',
      name: 'Maria da Silva',
    });

    expect(response.status).toBe(201);
    expect(response.body.document).toBe('52998224725');
    expect(producersService.create).toHaveBeenCalledWith({
      document: '529.982.247-25',
      name: 'Maria da Silva',
    });
  });

  it('POST /api/v1/producers returns validation error for invalid payload', async () => {
    const response = await request(app.getHttpServer()).post('/api/v1/producers').send({
      document: '',
      name: '',
    });

    expect(response.status).toBe(400);
    expect(response.body.statusCode).toBe(400);
    expect(response.body.path).toBe('/api/v1/producers');
  });

  it('POST /api/v1/farms creates a farm', async () => {
    farmsService.create.mockResolvedValue({
      id: '9ff97f6f-b474-4e6f-8d26-3ffbc367bfe3',
      producerId: '4d8b92d1-42a2-48a4-92f0-c20985060f54',
      name: 'Fazenda Primavera',
      city: 'Sorriso',
      state: 'MT',
      totalArea: 1000.5,
      arableArea: 700.25,
      vegetationArea: 300.25,
      createdAt: '2026-03-14T18:45:00.000Z',
      updatedAt: '2026-03-14T18:45:00.000Z',
    });

    const response = await request(app.getHttpServer()).post('/api/v1/farms').send({
      producerId: '4d8b92d1-42a2-48a4-92f0-c20985060f54',
      name: 'Fazenda Primavera',
      city: 'Sorriso',
      state: 'mt',
      totalArea: 1000.5,
      arableArea: 700.25,
      vegetationArea: 300.25,
    });

    expect(response.status).toBe(201);
    expect(response.body.state).toBe('MT');
  });

  it('POST /api/v1/farms returns domain error when areas are invalid', async () => {
    farmsService.create.mockRejectedValue(
      new BadRequestException('The sum of arableArea and vegetationArea cannot exceed totalArea'),
    );

    const response = await request(app.getHttpServer()).post('/api/v1/farms').send({
      producerId: '4d8b92d1-42a2-48a4-92f0-c20985060f54',
      name: 'Fazenda Primavera',
      city: 'Sorriso',
      state: 'MT',
      totalArea: 1000,
      arableArea: 800,
      vegetationArea: 300,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'The sum of arableArea and vegetationArea cannot exceed totalArea',
    );
  });

  it('GET /api/v1/dashboard returns aggregated data', async () => {
    dashboardService.getSummary.mockResolvedValue({
      totals: {
        farms: 10,
        totalHectares: 12345,
      },
      byState: [
        { state: 'MG', count: 4 },
        { state: 'SP', count: 6 },
      ],
      byCrop: [
        { crop: 'Soja', count: 7 },
        { crop: 'Milho', count: 3 },
      ],
      landUse: {
        arableArea: 8000,
        vegetationArea: 4345,
      },
    });

    const response = await request(app.getHttpServer()).get('/api/v1/dashboard');

    expect(response.status).toBe(200);
    expect(response.body.totals.farms).toBe(10);
    expect(response.body.byCrop[0].crop).toBe('Soja');
  });
});
