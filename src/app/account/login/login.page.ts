import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuController, NavController, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import HttpStatusCode from '../../shared/util/HttpStatusCode';
import { environment } from 'src/environments/environment';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { AccountService } from '../shared/account.service';
import { NewsService } from 'src/app/news/shared/news.service';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

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
  version = '';

  constructor(
    private translate: TranslateService,
    private menuCtrl: MenuController,
    private navCtrl: NavController,
    private router: Router,
    private accountService: AccountService,
    private newsService: NewsService,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private appVersion: AppVersion
  ) {
    this.menuCtrl.enable(false);
    this.defineVersion();

    if (!Capacitor.isNativePlatform()) {
      GoogleAuth.initialize({
        clientId: '486193508938-vdsv1h25dmgtmn1ajnshiu2q7lddubud.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
        grantOfflineAccess: false,
      });
    }
  }

  ngOnInit() {
    setTimeout(() => {
      SplashScreen.hide();
    }, 500);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async defineVersion() {
    if (Capacitor.isNativePlatform()) {
      this.version = await this.appVersion.getVersionNumber();
    } else {
      this.version = environment.appVersion;
    }
  }

  async login(loginForm: any) {
    if (loginForm.valid) {
      let loading = await this.loadingCtrl.create({
        message: this.translate.instant('loading.login')
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
          if (error.status === HttpStatusCode.UNAUTHORIZED) {
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

  async forgotPassword() {
    const alert = await this.alertController.create({
      cssClass: 'forgot-password-alert',
      header: this.translate.instant('login.passwordlost'),
      message: this.translate.instant('message.emailEnter'),
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: this.translate.instant('login.email')
        }
      ],
      buttons: [
        {
          text: this.translate.instant('buttons.cancel'),
          role: 'cancel'
        }, {
          text: this.translate.instant('buttons.done'),
          handler: async(resp: any) => {
            return await this.sendNewPassword(resp.email);
          }
        }
      ]
    });

    await alert.present();
  }

  private async sendNewPassword(email: string) {
    if (!new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$').test(email)) {
      const alert = await this.alertController.create({
        header: this.translate.instant('message.infotitle'),
        message: this.translate.instant('message.invalidEmail'),
        buttons: [this.translate.instant('buttons.done')]
      });
      alert.present();
    }

    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.loading')
    })

    loading.present();

    this.accountService.resetPassword(email).pipe(takeUntil(this.unsubscribe$)).subscribe((resp: any) => {
      loading.dismiss();
      const alert = this.alertController.create({
        header: this.translate.instant('message.infotitle'),
        message: this.translate.instant('message.pwdSend'),
        buttons: [this.translate.instant('buttons.done')]
      });
      alert.then(resp => {
        resp.present();
      })
    }, (error: any) => {
      loading.dismiss();
    });
    return true;
  }

  async googleLogin() {
    let loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.login')
    });
    await loading.present();

    const user = await GoogleAuth.signIn();
    if (user) {
      this.accountService.googleLogin(user.authentication.idToken).subscribe(async(resp: any) => {
        await loading.dismiss();
        localStorage.setItem('access_token', resp.access_token);
        localStorage.setItem('refresh_token', resp.refresh_token);
        this.router.navigate(['news']).then(() => {
          this.menuCtrl.enable(true);
        });
      }, (async (error: any) => {
        await loading.dismiss();
        if (error.status === HttpStatusCode.UNAUTHORIZED) {
          const alert = await this.alertController.create({
            header: this.translate.instant('buttons.login'),
            message: this.translate.instant('message.emailpwdnotcorrect'),
            buttons: [this.translate.instant('buttons.done')]
          });
          await alert.present();
        }
      }));
    }
  }
}
