import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private accoutService: AccountService
  ) { }

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const authenticated = await this.accoutService.isAuth();

    if (!authenticated) {
      // this.menuCtrl.enable(false);
      this.router.navigate(['login']);
    }

    return authenticated;
  }
}
