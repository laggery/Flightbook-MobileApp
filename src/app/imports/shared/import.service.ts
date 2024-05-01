import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ImportResult } from './import-result.model';
import { environment } from 'src/environments/environment';
import { ImportType } from './import-type.model';
import { IGNORE_ERROR } from 'src/app/shared/interceptor/error.interceptor';

@Injectable({
  providedIn: 'root'
})
export class ImportService {

  constructor(private httpClient: HttpClient) { }

  getImportTypes(): Observable<ImportType[]> {
    return this.httpClient.get<ImportType[]>(`${environment.baseUrl}/import/types`);
  }

  importData(formData: FormData, importType: string): Observable<ImportResult> {
    return this.httpClient
      .post<ImportResult>(`${environment.baseUrl}/import?type=${importType}`, formData, {
        reportProgress: true,
        context: new HttpContext().set(IGNORE_ERROR, true)
      });
  }
}
