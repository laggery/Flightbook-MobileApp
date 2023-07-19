import { TestBed } from '@angular/core/testing';

import { GliderService } from './glider.service';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GliderService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, TranslateModule.forRoot()],
    providers: [GliderService]
  }));

  it('should be created', () => {
    const service: GliderService = TestBed.inject(GliderService);
    expect(service).toBeTruthy();
  });
});
