import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from './user.model';
import { PaymentStatus } from './paymentStatus.model';
import { NavigationService } from 'src/app/shared/services/navigation.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private jwtHelper: JwtHelperService;

  constructor(private http: HttpClient, private naviagationService: NavigationService) {
    this.jwtHelper = new JwtHelperService();
  }

  refresh(refreshToken: string): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/auth/refresh/${refreshToken}`);
  }

  login(loginData: any): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}/auth/login`, loginData);
  }

  register(user: User): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}/users`, user);
  }

  logout(): Observable<any> {
    this.naviagationService.clearHistory();
    return this.http.get<any>(`${environment.baseUrl}/auth/logout`);
  }

  currentUser(): Observable<any> {
    return this.http.get<User>(`${environment.baseUrl}/users`);
  }

  verifyUser(token: string): Observable<any> {
    return this.http.get<User>(`${environment.baseUrl}/users/verify-email?token=${token}`);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${environment.baseUrl}/users`, user);
  }

  updateNotificationToken(notificationToken: string): Observable<any> {
    return this.http.put<any>(`${environment.baseUrl}/users/notification/token`, {token: notificationToken});
  }

  updatePassword(pwd: any): Observable<User> {
    return this.http.put<any>(`${environment.baseUrl}/users/password/change`, pwd);
  }

  resetPassword(email: string): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/auth/reset-password/${email}`);
  }

  deleteUser(): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/users`);
  }

  getPaymentStatus(): Observable<PaymentStatus> {
    return this.http.get<PaymentStatus>(`${environment.baseUrl}/payments/status`);
  }

  cancelPaymentSubscription(){
    return this.http.post(`${environment.baseUrl}/payments/cancel`, {});
  }

  async isAuth(): Promise<boolean> {
    let authenticated = true;
    const accessToken = localStorage.getItem('access_token');
    if (this.jwtHelper.isTokenExpired(accessToken)) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const loginData = await this.refresh(refreshToken).toPromise();
          if (loginData && loginData.access_token && loginData.refresh_token) {
            localStorage.setItem('access_token', loginData.access_token);
            localStorage.setItem('refresh_token', loginData.refresh_token);
          } else {
            authenticated = false;
          }
        } catch (e) {
          authenticated = false;
        }
      } else {
        authenticated = false;
      }
    }
    return authenticated;
  }

  getStripeSession(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/payments/stripe/session`);
  }
}
