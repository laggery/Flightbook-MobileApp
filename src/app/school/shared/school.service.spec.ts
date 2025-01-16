import { TestBed } from '@angular/core/testing';

import { SchoolService } from './school.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('SchoolService', () => {
  let service: SchoolService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [SchoolService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(SchoolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
