import { Component, effect, OnDestroy, OnInit } from '@angular/core';

import { MenuController, AlertController, IonicSafeString } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { filter, takeUntil } from 'rxjs/operators';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { AccountService } from './account/shared/account.service';
import { FlightStore } from './flight/shared/flight.store';
import { GliderStore } from './glider/shared/glider.store';
import { PlaceStore } from './place/shared/place.store';
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
import { StatusBar, Style } from '@capacitor/status-bar';
import { Router } from '@angular/router';
import { RegisterPage } from './account/register/register.page';
import { PaymentStatus } from './account/shared/paymentStatus.model';
import { PaymentService } from './shared/services/payment.service';
import { firstValueFrom, Subject } from 'rxjs';
import { ControlSheet } from './shared/domain/control-sheet';
import { Browser } from '@capacitor/browser';
import { addIcons } from "ionicons";
import { home, statsChart, cloudUpload, linkOutline, settings, ellipsisHorizontal, logOutOutline, school, document as iconDocument, bandage, checkmarkDone, personCircle, personCircleOutline } from 'ionicons/icons';
import { EmergencyContact } from './school/shared/emergency-contact.model';
import { User } from './account/shared/user.model';


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    standalone: false
})
export class AppComponent implements OnDestroy, OnInit {
    unsubscribe$ = new Subject<void>();
    schools: School[] = [];
    hasControlSheet = false;
    initialRequestsFired = false;
    hasEmergencyContacts = false;
    currentUser: User | undefined;


    constructor(
        private router: Router,
        private translate: TranslateService,
        private accountService: AccountService,
        private menuCtrl: MenuController,
        private swUpdate: SwUpdate,
        private flightStore: FlightStore,
        private gliderStore: GliderStore,
        private placeStore: PlaceStore,
        private schoolService: SchoolService,
        private alertController: AlertController,
        private paymentService: PaymentService
    ) {
        this.translate.setDefaultLang('en');
        this.translate.use(localStorage.getItem('language') || navigator.language.split('-')[0]);
        
        effect(() => {
            this.currentUser = this.accountService.currentUser$();
        });

        addIcons({
            home,
            statsChart,
            cloudUpload,
            linkOutline,
            bandage,
            settings,
            ellipsisHorizontal,
            logOutOutline,
            school,
            checkmarkDone,
            personCircleOutline,
            'document': iconDocument,
            'flight': 'assets/custom-ion-icons/flight.svg',
            'copyflight': 'assets/custom-ion-icons/copyflight.svg',
            'glider': 'assets/custom-ion-icons/glider.svg',
            'place': 'assets/custom-ion-icons/place.svg'
        });
    }

    async ngOnInit(): Promise<void> {
        // Fix EdgeToEdge header issue: ensure StatusBar overlaysWebView is false and set style
        try {
            if (Capacitor.isNativePlatform() && Capacitor.getPlatform() == "android") {
                await StatusBar.setOverlaysWebView({ overlay: false });
            }
        } catch (e) {
            // StatusBar not available or not supported
            console.warn('StatusBar plugin not available:', e);
        }

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
        this.flightStore.clearFlights();
        this.gliderStore.clearGliders();
        this.placeStore.clearPlaces();
        this.accountService.logout(localStorage.getItem('refresh_token')).pipe(takeUntil(this.unsubscribe$)).subscribe(resp => {
            // TODO error handling
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('last_login');
            this.initialRequestsFired = false;
            this.schoolService.clearSchools();
        });
        this.schools = [];
    }

    subscribeToEmmiter(componentRef: any) {
        if (componentRef instanceof LoginPage || componentRef instanceof RegisterPage || this.initialRequestsFired) {
            return;
        }

        this.schoolService.getSchools().then((schools: School[]) => {
            this.schools = schools;
        });

        this.schoolService.getControlSheet().pipe(takeUntil(this.unsubscribe$)).subscribe((controlSheet: ControlSheet) => {
            this.hasControlSheet = controlSheet ? true : false;
        })

        this.schoolService.getEmergencyContacts().pipe(takeUntil(this.unsubscribe$)).subscribe((emergencyContacts: EmergencyContact[]) => {
            this.hasEmergencyContacts = emergencyContacts && emergencyContacts.length > 0 ? true : false;
        })

        this.accountService.currentUser().pipe(takeUntil(this.unsubscribe$)).subscribe((user: any) => {});

        if (Capacitor.isNativePlatform()) {
            this.initPushNotification();
        }

        this.accountService.getPaymentStatus().pipe(takeUntil(this.unsubscribe$)).subscribe(async(paymentStatus: PaymentStatus) => {
            this.paymentService.setPaymentStatus(paymentStatus);
            if (paymentStatus?.state != 'EXEMPTED' && !paymentStatus.active && this.accountService.getLastLogin() == null) {
                localStorage.setItem('last_login', new Date().toISOString());
                const alert = await this.alertController.create({
                    header: this.translate.instant('message.infotitle'),
                    message: new IonicSafeString(this.translate.instant('payment.welcome')),
                    buttons: [{
                        text: this.translate.instant('buttons.done'),
                    }],
                });
                await alert.present();
            }
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
                                } else if (type == "FLIGHT_VALIDATION_REJECTED") {
                                    const flightId = notification.data.flightId
                                    this.router.navigate(
                                        ['/flights/', flightId]
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
                } else if (type == "FLIGHT_VALIDATION_REJECTED") {
                    const flightId = notification.notification.data.flightId
                    this.router.navigate(
                        ['/flights/', flightId]
                    );
                }
            }
        );
    }

    async openBrowser(type: string) {
        let url

        switch (type) {
            case "shvWeather":
                if (this.translate.currentLang === 'fr') {
                    url = "https://www.meteo-fsvl.ch";
                } else {
                    url = "https://www.meteo-shv.ch";
                }

                break;
            case "dabsToday":
                url = "https://www.skybriefing.com/o/dabs?today";
                break;
            case "dabsTomorrow":
                url = "https://www.skybriefing.com/o/dabs?tomorrow";
                break;
            default:
                return;
        }

        const browserOption = {
            url: url
        }
        Browser.open(browserOption);
    }

    async openLink(link: string) {
        if (!link || link === '') {
            return;
        }

        Browser.open({
            url: link
        });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
