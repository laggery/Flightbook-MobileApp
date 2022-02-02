import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Store } from './store.class';
import { News } from '../domain/news';
import { environment } from 'src/environments/environment';

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
        const newState = [...this.getValue(), ...response];
        this.setState(newState);
        return response;
      })
    );
  }
}
