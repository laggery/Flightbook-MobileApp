import { TestBed } from '@angular/core/testing';

import { GliderService } from './glider.service';

describe('GliderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GliderService = TestBed.get(GliderService);
    expect(service).toBeTruthy();
  });
});
