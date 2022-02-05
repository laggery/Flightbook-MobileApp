import { TestBed } from '@angular/core/testing';

import { FlightService } from './flight.service';

describe('FlightService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FlightService = TestBed.get(FlightService);
    expect(service).toBeTruthy();
  });
});
