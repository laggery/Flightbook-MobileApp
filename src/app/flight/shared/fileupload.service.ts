import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ImportType } from 'src/app/imports/shared/import-type';
import { ImportResult } from 'src/app/imports/shared/import-result.model';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private httpClient: HttpClient) {
  }

  uploadFile(formData: FormData): Observable<any> {
    return this.httpClient
      .post(`${environment.baseUrl}/file/upload`, formData, {
        reportProgress: true,
        observe: 'events',
      })
  }

  getPresignedUploadUrl(filename: string): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/file/upload/url/${filename}`);
  }

  uploadFileToS3(url: string, file: File) {
    const headers = new HttpHeaders();
    headers.append("Content-Type", file.type);
    return this.httpClient.put(url, file, {headers: headers})
  }

  copyFile(sourceFileName: string, destinationFileName: string): Observable<any> {
    return this.httpClient
      .post(`${environment.baseUrl}/file/copy`, {
        sourceFileName: sourceFileName,
        destinationFileName: destinationFileName
      }, {
        reportProgress: true,
        observe: 'events',
      })
  }

  getFile(filename: string): Observable<Blob> {
    return this.httpClient.get(`${environment.baseUrl}/file/${filename}`, {
      responseType: 'blob'
    });
  }

  uploadImportData(formData: FormData, importType: ImportType): Observable<ImportResult> {
    return this.httpClient
      .post<ImportResult>(`${environment.baseUrl}/file/import?type=${importType}`, formData, {
        reportProgress: true
      })
  }
}
