import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private jwtHelper: JwtHelperService;

  constructor(private http: HttpClient) {
    this.jwtHelper = new JwtHelperService();
   }

  refresh(refreshToken: string): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/auth/refresh/${refreshToken}`, { observe: 'response' });
  }

  login(loginData): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}/auth/login`, loginData, { observe: 'response' });
  }

  logout(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/auth/logout`, { observe: 'response' });
  }

  async isAuth(): Promise<boolean> {
    let authenticated = true;
    const accessToken = localStorage.getItem('access_token');
    if (this.jwtHelper.isTokenExpired(accessToken)) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        const loginData = await this.refresh(refreshToken).toPromise();
        if (loginData.body && loginData.body.access_token && loginData.body.refresh_token) {
          localStorage.setItem('access_token', loginData.body.access_token);
          localStorage.setItem('refresh_token', loginData.body.refresh_token);
        } else {
          authenticated = false;
        }
      } else {
        authenticated = false;
      }
    }
    return authenticated;
  }
}
