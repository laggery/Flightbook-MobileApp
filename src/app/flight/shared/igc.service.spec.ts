import { TestBed } from '@angular/core/testing';

import { IgcService } from './igc.service';

describe('IgcService', () => {
  let service: IgcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IgcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
