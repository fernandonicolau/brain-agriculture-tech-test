import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(() => {
    controller = new HealthController();
  });

  it('returns the service health payload', () => {
    const result = controller.check();

    expect(result.status).toBe('ok');
    expect(result.service).toBe('brain-agriculture-api');
    expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
  });
});
