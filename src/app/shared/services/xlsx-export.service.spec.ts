import { TestBed } from '@angular/core/testing';

import { XlsxExportService } from './xlsx-export.service';
import { TranslateModule } from '@ngx-translate/core';

describe('ExportService', () => {
  let service: XlsxExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()]
    });
    service = TestBed.inject(XlsxExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
