import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuController, NavController } from '@ionic/angular';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  loginData = {
    email: '',
    password: ''
  };

  constructor(
    private translate: TranslateService,
    private menuCtrl: MenuController,
    private navCtrl: NavController,
    private router: Router,
    private accountService: AccountService
  ) {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  login(loginForm: any) {
    if (loginForm.valid) {
      this.accountService.login(this.loginData).pipe(takeUntil(this.unsubscribe$)).subscribe(resp => {
        if (resp.body && resp.body.access_token && resp.body.refresh_token) {
          localStorage.setItem('access_token', resp.body.access_token);
          localStorage.setItem('refresh_token', resp.body.refresh_token);
          this.router.navigate(['news']).then(() => {
            this.menuCtrl.enable(true);
          });
        }
      });
    } else {
      // TODO information message
    }
  }

  setLanguage(lang: string) {
    localStorage.setItem('language', lang);
    this.translate.use(lang);
  }

  register() {
    this.navCtrl.navigateForward(`register`);
  }

}
