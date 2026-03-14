import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  let controller: HealthController;
  let healthService: jest.Mocked<HealthService>;

  beforeEach(() => {
    healthService = {
      check: jest.fn(),
      liveness: jest.fn(),
      readiness: jest.fn(),
    } as unknown as jest.Mocked<HealthService>;

    controller = new HealthController(healthService);
  });

  it('returns the service health payload', async () => {
    healthService.check.mockResolvedValue({
      status: 'ok',
      service: 'brain-agriculture-api',
      timestamp: new Date().toISOString(),
      environment: 'test',
    });

    const result = await controller.check();

    expect(result.status).toBe('ok');
    expect(result.service).toBe('brain-agriculture-api');
    expect(result.environment).toBe('test');
    expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
    expect(healthService.check).toHaveBeenCalledWith(false);
  });

  it('can request a database check', async () => {
    healthService.check.mockResolvedValue({
      status: 'ok',
      service: 'brain-agriculture-api',
      timestamp: new Date().toISOString(),
      environment: 'test',
      database: 'up',
    });

    await controller.check('true');

    expect(healthService.check).toHaveBeenCalledWith(true);
  });

  it('returns liveness status', async () => {
    healthService.liveness.mockResolvedValue({
      status: 'ok',
      service: 'brain-agriculture-api',
      timestamp: new Date().toISOString(),
      environment: 'test',
    });

    const result = await controller.live();

    expect(result.status).toBe('ok');
    expect(healthService.liveness).toHaveBeenCalled();
  });

  it('returns readiness status', async () => {
    healthService.readiness.mockResolvedValue({
      status: 'ok',
      service: 'brain-agriculture-api',
      timestamp: new Date().toISOString(),
      environment: 'test',
      database: 'up',
    });

    const result = await controller.ready();

    expect(result.database).toBe('up');
    expect(healthService.readiness).toHaveBeenCalled();
  });
});
