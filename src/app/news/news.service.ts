import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private http: HttpClient) { }

  getNews(language): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/news/${language}`, { observe: 'response' });
  }
}
