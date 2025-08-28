import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { News } from './news.model';

export interface NewsState {
  news: News[];
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class NewsStore {
  // HTTP client
  private http = inject(HttpClient);
  
  // State
  private state = signal<NewsState>({
    news: [],
    loading: false,
    error: null
  });
  
  public news = computed(() => this.state().news);
  public loading = computed(() => this.state().loading);
  public error = computed(() => this.state().error);
  
  constructor() {}
  
  getNews(language: string): Observable<News[]> {
    this.state.update(state => ({ ...state, loading: true }));
    
    return this.http.get<News[]>(`${environment.baseUrl}/news/${language}`).pipe(
      tap({
        next: (response: News[]) => {
          this.state.update(state => ({
            ...state,
            news: response,
            loading: false,
            error: null
          }));
        },
        error: (error) => {
          this.state.update(state => ({ 
            ...state, 
            loading: false, 
            error: error.message || 'An error occurred while fetching news' 
          }));
        }
      }),
      map(response => response)
    );
  }
  
  clearNews(): void {
    this.state.update(state => ({ ...state, news: [] }));
  }
}
