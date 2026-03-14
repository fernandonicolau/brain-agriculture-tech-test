import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  let controller: HealthController;
  let healthService: jest.Mocked<HealthService>;

  beforeEach(() => {
    healthService = {
      check: jest.fn(),
    } as unknown as jest.Mocked<HealthService>;

    controller = new HealthController(healthService);
  });

  it('returns the service health payload', async () => {
    healthService.check.mockResolvedValue({
      status: 'ok',
      service: 'brain-agriculture-api',
      timestamp: new Date().toISOString(),
    });

    const result = await controller.check();

    expect(result.status).toBe('ok');
    expect(result.service).toBe('brain-agriculture-api');
    expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
    expect(healthService.check).toHaveBeenCalledWith(false);
  });

  it('can request a database check', async () => {
    healthService.check.mockResolvedValue({
      status: 'ok',
      service: 'brain-agriculture-api',
      timestamp: new Date().toISOString(),
      database: 'up',
    });

    await controller.check('true');

    expect(healthService.check).toHaveBeenCalledWith(true);
  });
});
