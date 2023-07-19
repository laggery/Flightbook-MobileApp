import { TestBed } from '@angular/core/testing';

import { PdfExportService } from './pdf-export.service';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

describe('PdfExportService', () => {
  let service: PdfExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [DatePipe]
    });
    service = TestBed.inject(PdfExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
