import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, map, Observable } from 'rxjs';
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
  public currentUser$: WritableSignal<User> = signal(null);

  constructor(private http: HttpClient, private naviagationService: NavigationService) {
    this.jwtHelper = new JwtHelperService();
  }

  refresh(refreshToken: string): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}/auth/refresh`, { "refresh_token": refreshToken }).pipe(
      map((response: any) => {
        if (response.lastLogin && response.lastLogin !== null) {
          localStorage.setItem('last_login', response.lastLogin);
        }
        return response;
      })
    );
  }

  login(loginData: any): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}/auth/login`, loginData).pipe(
      map((response: any) => {
        if (response.lastLogin && response.lastLogin !== null) {
          localStorage.setItem('last_login', response.lastLogin);
        }
        return response;
      })
    );
  }

  register(user: User): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}/v2/users`, user);
  }

  logout(refreshToken: string): Observable<any> {
    this.naviagationService.clearHistory();
    this.currentUser$.set(null);
    return this.http.post<any>(`${environment.baseUrl}/auth/logout`, { "refresh_token": refreshToken });
  }

  currentUser(): Observable<any> {
    return this.http.get<User>(`${environment.baseUrl}/users`).pipe(
      map((response: any) => {
        this.initializeUserConfig(response);
        this.currentUser$.set(response);
        return response;
      })
    );
  }

  verifyUser(token: string): Observable<any> {
    return this.http.get<User>(`${environment.baseUrl}/users/verify-email?token=${token}`);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${environment.baseUrl}/users`, user).pipe(
      map((response: any) => {
        this.currentUser$.set(response);
        return response;
      })
    );
  }

  updateNotificationToken(notificationToken: string): Observable<any> {
    return this.http.put<any>(`${environment.baseUrl}/users/notification/token`, { token: notificationToken });
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

  cancelPaymentSubscription() {
    return this.http.post(`${environment.baseUrl}/payments/cancel`, {});
  }

  async isAuth(): Promise<boolean> {
    let authenticated = true;
    const accessToken = localStorage.getItem('access_token');
    if (this.jwtHelper.isTokenExpired(accessToken)) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const loginData = await firstValueFrom(this.refresh(refreshToken));
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

  getLastLogin(): Date {
    if (localStorage.getItem('last_login') !== null) {
      return new Date(localStorage.getItem('last_login'))
    }
    return null;
  }

  private initializeUserConfig(user: User) {
          if (user && !user.config) {
              user.config = {};
          }
          if (!user.config.preparation) {
              user.config.preparation = {
                  shvLinkDisabled: false,
                  dabsLinkDisabled: false,
                  links: []
              };
          }
          if (!user.config.notifications) {
              user.config.notifications = {
                  email: {
                      appointment: true
                  }
              };
          }
          if (!user.config.notifications.email) {
              user.config.notifications.email = {
                  appointment: true
              };
        }
      }
}
