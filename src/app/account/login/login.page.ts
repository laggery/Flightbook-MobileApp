import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuController, NavController, AlertController, LoadingController } from '@ionic/angular';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NewsService } from 'src/app/news/news.service';

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
    private accountService: AccountService,
    private newsService: NewsService,
    private alertController: AlertController,
    private loadingCtrl: LoadingController
  ) {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async login(loginForm: any) {
    if (loginForm.valid) {
      let loading = await this.loadingCtrl.create({
        message: this.translate.instant('loading.saveaccount')
      });
      await loading.present();

      this.accountService.login(this.loginData).pipe(takeUntil(this.unsubscribe$)).subscribe(async resp => {
        await loading.dismiss();
        localStorage.setItem('access_token', resp.access_token);
        localStorage.setItem('refresh_token', resp.refresh_token);
        this.router.navigate(['news']).then(() => {
          this.menuCtrl.enable(true);
        });
      },
        (async (error: any) => {
          await loading.dismiss();
          if (error.status === 401) {
            const alert = await this.alertController.create({
              header: this.translate.instant('buttons.login'),
              message: this.translate.instant('message.emailpwdnotcorrect'),
              buttons: [this.translate.instant('buttons.done')]
            });
            await alert.present();
          }
        }));
    } else {
      const alert = await this.alertController.create({
        header: this.translate.instant('buttons.login'),
        message: this.translate.instant('message.nologinpwd'),
        buttons: [this.translate.instant('buttons.done')]
      });
      await alert.present();
    }
  }

  setLanguage(lang: string) {
    localStorage.setItem('language', lang);
    this.translate.use(lang);
    this.newsService.setState([]);
  }

  register() {
    this.navCtrl.navigateForward(`register`);
  }

}
