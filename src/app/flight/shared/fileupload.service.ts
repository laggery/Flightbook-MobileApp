import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

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
}
