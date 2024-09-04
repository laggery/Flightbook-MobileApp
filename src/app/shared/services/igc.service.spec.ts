import { TestBed } from '@angular/core/testing';

import { IgcService } from './igc.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('IgcService', () => {
  let service: IgcService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [IgcService]
    });
    service = TestBed.inject(IgcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
