import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, LoadingController, MenuController, NavController } from '@ionic/angular';
import HttpStatusCode from '../../shared/util/HttpStatusCode';
import { User } from 'src/app/account/shared/user.model';
import { AccountService } from '../shared/account.service';
import { FlightService } from 'src/app/flight/shared/flight.service';
import { GliderService } from 'src/app/glider/shared/glider.service';
import { PlaceService } from 'src/app/place/shared/place.service';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { PaymentService } from 'src/app/shared/services/payment.service';
import { PaymentStatus } from '../shared/paymentStatus.model';
import { Capacitor } from '@capacitor/core';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  user: User;
  paymentStatus: PaymentStatus;
  isNative: boolean;

  constructor(
    private translate: TranslateService,
    private accountService: AccountService,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private flightService: FlightService,
    private gliderService: GliderService,
    private placeService: PlaceService,
    private menuCtrl: MenuController,
    public navCtrl: NavController,
    private paymentService: PaymentService,
    private route: ActivatedRoute
  ) {
    this.isNative = Capacitor.isNativePlatform();
    this.accountService.currentUser().pipe(takeUntil(this.unsubscribe$)).subscribe((resp: User) => {
      this.user = resp;
    })

    this.paymentService.getPaymentStatus().pipe(takeUntil(this.unsubscribe$)).subscribe((paymentStatus: PaymentStatus) => {
      this.paymentStatus = paymentStatus;
    });

    const paymentStatus = this.route.snapshot.paramMap.get('payment');
    if (paymentStatus == "success") {
      this.paymentSuccess();
    }
  }

  ngOnInit() {
  }

  async paymentSuccess(){
    const alert = await this.alertController.create({
      header: this.translate.instant('message.infotitle'),
      message: this.translate.instant('payment.thanks'),
      buttons: [{
        text: this.translate.instant('buttons.done'),
        handler: () => {
          this.paymentService.setPaymentStatus({ active: true, state: 'ACTIVE', expires_date: moment().add(1, 'year').toDate()});
        }
      }]
    });
    await alert.present();
  }

  async saveSettings() {
    let loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.saveaccount')
    });
    await loading.present();

    this.accountService.updateUser(this.user).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: async (resp: User) => {
        await loading.dismiss();
      },
      error: async (error: any) => {
        await loading.dismiss();
        if (error.status === HttpStatusCode.CONFLICT) {
          const alert = await this.alertController.create({
            header: this.translate.instant('message.infotitle'),
            message: this.translate.instant('message.userExist'),
            buttons: [this.translate.instant('buttons.done')]
          });
          await alert.present();
        }
      }
    })
  }

  async getStripeSession() {
    let loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.loading')
    });
    await loading.present();

    const session = await firstValueFrom(this.accountService.getStripeSession());
    window.open(session.url, '_self');
  }

  async cancelSubscription() {
    const alert = await this.alertController.create({
      header: this.translate.instant('message.warning'),
      message: this.translate.instant('message.cancelPymentSubscription'),
      buttons: [
        {
          text: this.translate.instant('buttons.yes'),
          handler: async () => {
            const loading = await this.loadingCtrl.create({
              message: this.translate.instant('loading.login')
            });
            await loading.present();
        
            this.accountService.cancelPaymentSubscription().pipe(takeUntil(this.unsubscribe$)).subscribe({
              next: (res: any) => {
                this.paymentStatus.state = 'CANCELED';
                loading.dismiss();
              },
              error: (res: any) => {
                loading.dismiss();
              }
            });
          }
        },
        {
          text: this.translate.instant('buttons.no')
        }
      ]
    });

    await alert.present();
  }

  setLanguage(lang: string) {
    localStorage.setItem('language', lang);
    this.translate.use(lang)
  }

  async deleteAccount() {
    const alert = await this.alertController.create({
      header: this.translate.instant('message.warning'),
      message: this.translate.instant('message.deleteAccount'),
      buttons: [
        {
          text: this.translate.instant('buttons.yes'),
          handler: async () => {
            this.accountService.deleteUser().pipe(takeUntil(this.unsubscribe$)).subscribe({
              next: (res: any) => {
                this.menuCtrl.enable(false);
                this.flightService.setState([]);
                this.gliderService.setState([]);
                this.placeService.setState([]);
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                this.navCtrl.navigateRoot('login');
              }
            })
          }
        },
        {
          text: this.translate.instant('buttons.no')
        }
      ]
    });

    await alert.present();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
