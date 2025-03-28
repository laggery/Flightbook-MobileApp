import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MenuController, NavController, AlertController, LoadingController, IonContent, IonItem, IonInput, IonButton, IonFooter, IonInputPasswordToggle } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
setTimeout(() => {
    SplashScreen.hide();
}, 700);
import HttpStatusCode from '../../shared/util/HttpStatusCode';
import { environment } from 'src/environments/environment';
import { AccountService } from '../shared/account.service';
import { NewsService } from 'src/app/news/shared/news.service';
import { App } from '@capacitor/app';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    imports: [
        FormsModule,
        TranslateModule,
        IonContent,
        IonItem,
        IonInput,
        IonButton,
        IonFooter,
        IonInputPasswordToggle
    ]
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
        private accountService: AccountService,
        private newsService: NewsService,
        private alertController: AlertController,
        private loadingCtrl: LoadingController,
        private navigationService: NavigationService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.menuCtrl.enable(false);
        this.defineVersion();
    }

    ngOnInit() {
        const token = this.route.snapshot.queryParamMap.get('token');
        if (token) {
            // Remove token from URL
            this.router.navigate([], {
                queryParams: { token: null },
                queryParamsHandling: 'merge',
                replaceUrl: true
            });
            this.navigationService.clearHistory();
            this.accountService.verifyUser(token).pipe(
                takeUntil(this.unsubscribe$)
            ).subscribe({
                next: async () => {
                    const alert = await this.alertController.create({
                        header: this.translate.instant('account.verification'),
                        message: this.translate.instant('message.accountVerificationSuccess'),
                        buttons: [this.translate.instant('buttons.done')]
                    });
                    await alert.present();
                },
                error: async (error) => {
                    const alert = await this.alertController.create({
                        header: this.translate.instant('account.verification'),
                        message: this.translate.instant('message.accountVerificationError'),
                        buttons: [this.translate.instant('buttons.done')]
                    });
                    await alert.present();
                }
            });
        }
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    async defineVersion() {
        if (Capacitor.isNativePlatform()) {
            this.version = (await App.getInfo()).version;
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

            this.accountService.login(this.loginData).pipe(takeUntil(this.unsubscribe$)).subscribe({
                next: async resp => {
                    await loading.dismiss();
                    localStorage.setItem('access_token', resp.access_token);
                    localStorage.setItem('refresh_token', resp.refresh_token);
                    this.navigationService.back();
                    this.menuCtrl.enable(true);
                    this.loginData.email = null;
                    this.loginData.password = null;
                },
                error: (async (error: any) => {
                    await loading.dismiss();
                    if (error.status === HttpStatusCode.UNAUTHORIZED) {
                        let message = this.translate.instant('message.emailpwdnotcorrect');
                        if (error.error.message === "account not validated") {
                            message = this.translate.instant('message.accountNotValidated')
                        }
                        const alert = await this.alertController.create({
                            header: this.translate.instant('buttons.login'),
                            message: message,
                            buttons: [this.translate.instant('buttons.done')]
                        });
                        await alert.present();
                    }
                })
            });
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
                    handler: (resp: any) => {
                        return this.sendNewPassword(resp.email);
                    }
                }
            ]
        });

        await alert.present();
    }

    private sendNewPassword(email: string) {
        if (!new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$').test(email)) {
            const alert = this.alertController.create({
                header: this.translate.instant('message.infotitle'),
                message: this.translate.instant('message.invalidEmail'),
                buttons: [this.translate.instant('buttons.done')]
            });
            alert.then(resp => {
                resp.present();
            })
            return false;
        }

        let loading: HTMLIonLoadingElement;
        this.loadingCtrl.create({
            message: this.translate.instant('loading.loading')
        }).then((resp: HTMLIonLoadingElement) => {
            loading = resp;
            loading.present();
        });

        this.accountService.resetPassword(email).pipe(takeUntil(this.unsubscribe$)).subscribe({
            next: (resp: any) => {
                loading.dismiss();
                const alert = this.alertController.create({
                    header: this.translate.instant('message.infotitle'),
                    message: this.translate.instant('message.pwdSend'),
                    buttons: [this.translate.instant('buttons.done')]
                });
                alert.then(resp => {
                    resp.present();
                })
            },
            error: (error: any) => {
                loading.dismiss();
            }
        });
        return true;
    }

    changeEmail(event: any) {
        this.loginData.email = event.target.value;
    }

    changePassword(event: any) {
        this.loginData.password = event.target.value;
    }
}
