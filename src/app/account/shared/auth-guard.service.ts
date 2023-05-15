import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService  {

  constructor(
    private router: Router,
    private accoutService: AccountService
  ) { }

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const authenticated = await this.accoutService.isAuth();

    if (!authenticated) {
      this.router.navigate(['login']);
    }

    return authenticated;
  }
}
