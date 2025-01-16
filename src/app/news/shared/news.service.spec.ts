import { TestBed } from '@angular/core/testing';

import { NewsService } from './news.service';
import { TranslateModule } from '@ngx-translate/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('NewsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [TranslateModule.forRoot()],
    providers: [NewsService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}));

  it('should be created', () => {
    const service: NewsService = TestBed.get(NewsService);
    expect(service).toBeTruthy();
  });
});
