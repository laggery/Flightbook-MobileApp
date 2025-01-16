import { TestBed } from '@angular/core/testing';

import { GliderService } from './glider.service';
import { TranslateModule } from '@ngx-translate/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('GliderService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [TranslateModule.forRoot()],
    providers: [GliderService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}));

  it('should be created', () => {
    const service: GliderService = TestBed.inject(GliderService);
    expect(service).toBeTruthy();
  });
});
