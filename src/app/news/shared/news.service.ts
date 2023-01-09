import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Store } from 'src/app/shared/services/store.class';
import { News } from './news.model';

@Injectable({
  providedIn: 'root'
})
export class NewsService extends Store<News[]> {

  constructor(private http: HttpClient) {
    super([]);
  }

  getNews(language: string): Observable<any> {
    return this.http.get<News[]>(`${environment.baseUrl}/news/${language}`).pipe(
      map((response: News[]) => {
        const newState = [...response];
        this.setState(newState);
        return response;
      })
    );
  }
}
