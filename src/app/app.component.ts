import { Component, OnDestroy, OnInit } from '@angular/core';

import { MenuController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { filter, takeUntil } from 'rxjs/operators';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { AccountService } from './account/shared/account.service';
import { FlightService } from './flight/shared/flight.service';
import { GliderService } from './glider/shared/glider.service';
import { PlaceService } from './place/shared/place.service';
import { SchoolService } from './school/shared/school.service';
import { School } from './school/shared/school.model';
import { LoginPage } from './account/login/login.page';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { Router } from '@angular/router';
import { RegisterPage } from './account/register/register.page';
import { PaymentStatus } from './account/shared/paymentStatus.model';
import { PaymentService } from './shared/services/payment.service';
import { firstValueFrom, Subject } from 'rxjs';
import { ControlSheet } from './shared/domain/control-sheet';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {
  unsubscribe$ = new Subject<void>();
  schools: School[] = [];
  hasControlSheet = false;
  initialRequestsFired = false;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private accountService: AccountService,
    private menuCtrl: MenuController,
    private swUpdate: SwUpdate,
    private flighService: FlightService,
    private gliderService: GliderService,
    private placeService: PlaceService,
    private schoolService: SchoolService,
    private alertController: AlertController,
    private paymentService: PaymentService
  ) {
    this.translate.setDefaultLang('en');
    this.translate.use(localStorage.getItem('language') || navigator.language.split('-')[0]);
  }

  ngOnInit(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
        .subscribe(async evt => {
          const alert = await this.alertController.create({
            header: this.translate.instant('message.infotitle'),
            message: this.translate.instant('message.newVersion'),
            backdropDismiss: false,
            buttons: [
              {
                text: this.translate.instant('buttons.done'),
                handler: () => {
                  document.location.reload();
                }
              }
            ]
          });
          await alert.present();
        });
    }
  }

  logout() {
    this.menuCtrl.enable(false);
    this.flighService.setState([]);
    this.gliderService.setState([]);
    this.placeService.setState([]);
    this.accountService.logout().pipe(takeUntil(this.unsubscribe$)).subscribe(resp => {
      // TODO error handling
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      this.initialRequestsFired = false;
    });
    this.schools = [];
  }

  subscribeToEmmiter(componentRef: any) {
    if (componentRef instanceof LoginPage || componentRef instanceof RegisterPage || this.initialRequestsFired) {
      return;
    }

    this.schoolService.getSchools().pipe(takeUntil(this.unsubscribe$)).subscribe((schools: School[]) => {
      this.schools = schools;
    })

    this.schoolService.getControlSheet().pipe(takeUntil(this.unsubscribe$)).subscribe((controlSheet: ControlSheet) => {
      this.hasControlSheet = controlSheet ? true : false;
    })

    if (Capacitor.isNativePlatform()) {
      this.initPushNotification();
    }

    this.accountService.getPaymentStatus().pipe(takeUntil(this.unsubscribe$)).subscribe((paymentStatus: PaymentStatus) => {
      this.paymentService.setPaymentStatus(paymentStatus);
    })

    this.initialRequestsFired = true;
  }

  private initPushNotification() {
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    PushNotifications.addListener('registration', (token: Token) => {
      // Push Notifications registered successfully.
      // Send token details to API to keep in DB.
      firstValueFrom(this.accountService.updateNotificationToken(token.value));
    });

    PushNotifications.addListener('registrationError', async (error: any) => {
      // Handle push notification registration error here.
      const alert = await this.alertController.create({
        header: this.translate.instant('message.warning'),
        message: this.translate.instant('message.notificationRegistrationFailed'),
        backdropDismiss: false,
        buttons: [
          {
            text: this.translate.instant('buttons.done')
          }
        ]
      });
      await alert.present();
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotificationSchema) => {
        // Show the notification payload if the app is open on the device.
        const alert = await this.alertController.create({
          header: notification.title,
          message: notification.body.replace('\r\n', '<br/>'),
          backdropDismiss: false,
          buttons: [
            {
              text: this.translate.instant('buttons.done')
            },
            {
              text: this.translate.instant('buttons.show'),
              handler: () => {
                const type = notification.data.type
                if (type == "APPOINTMENT") {
                  const schoolId = notification.data.schoolId
                  const appointmentId = notification.data.appointmentId
                  this.router.navigate(
                    ['/school/', schoolId],
                    { queryParams: { appointmentId: appointmentId } }
                  );
                }
              }
            }
          ]
        });
        await alert.present();
      }
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        // Action when user tap on a notification.
        const type = notification.notification.data.type
        if (type == "APPOINTMENT") {
          const schoolId = notification.notification.data.schoolId
          const appointmentId = notification.notification.data.appointmentId
          this.router.navigate(
            ['/school/', schoolId],
            { queryParams: { appointmentId: appointmentId } }
          );
        }
      }
    );
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
