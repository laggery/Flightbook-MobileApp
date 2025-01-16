import { TestBed } from '@angular/core/testing';

import { IgcService } from './igc.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('IgcService', () => {
  let service: IgcService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [IgcService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(IgcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
