import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AccountService } from './account.service';
import { MenuController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private jwtHelper: JwtHelperService,
    private accoutService: AccountService,
    private menuCtrl: MenuController
  ) { }

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const authInfo = {
      authenticated: true
    };
    const accessToken = localStorage.getItem('access_token');
    if (this.jwtHelper.isTokenExpired(accessToken)) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        const loginData = await this.accoutService.refresh(refreshToken).toPromise();
        if (loginData.body && loginData.body.access_token && loginData.body.refresh_token) {
          localStorage.setItem('access_token', loginData.body.access_token);
          localStorage.setItem('refresh_token', loginData.body.refresh_token);
        } else {
          authInfo.authenticated = false;
        }
      } else {
        authInfo.authenticated = false;
      }
    }

    if (!authInfo.authenticated) {
      this.menuCtrl.enable(false);
      this.router.navigate(['login']);
      return false;
    }

    return true;
  }
}
