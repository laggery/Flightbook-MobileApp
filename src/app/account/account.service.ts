import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { }

  refresh(refreshToken: string): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/auth/refresh/${refreshToken}`, { observe: 'response' });
  }

  login(loginData): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}/auth/login`, loginData, { observe: 'response' });
  }

  logout(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/auth/logout`, { observe: 'response' });
  }
}
