import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, ModalController, NavController, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonButton, IonIcon, IonContent, IonList, IonItem, IonToggle, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { AccountService } from 'src/app/account/shared/account.service';
import { User } from 'src/app/account/shared/user.model';
import { Appointment } from '../shared/appointment.model';
import { SchoolService } from '../shared/school.service';
import { Subscription } from '../shared/subscription.model';
import { AppointmentDetailsComponent } from '../shared/components/appointment-details/appointment-details.component';
import { AppointmentFilterComponent } from '../shared/components/appointment-filter/appointment-filter.component';
import { State } from '../shared/state';
import { NgIf, NgClass, DatePipe } from '@angular/common';
import { addIcons } from "ionicons";
import { filterOutline } from "ionicons/icons";
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-appointment-list',
    templateUrl: './appointment-list.page.html',
    styleUrls: ['./appointment-list.page.scss'],
    imports: [
        NgIf,
        NgClass,
        DatePipe,
        TranslateModule,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonMenuButton,
        IonTitle,
        IonButton,
        IonIcon,
        IonContent,
        IonList,
        IonItem,
        IonToggle,
        IonLabel,
        IonInfiniteScroll,
        IonInfiniteScrollContent,
        FormsModule
    ]
})
export class AppointmentListPage implements OnInit, OnDestroy {
    @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;
    unsubscribe$ = new Subject<void>();
    appointments: Appointment[];
    currentUser: User;
    currentLang: string;
    filtered: boolean;
    private readonly schoolId: number;
    private appointmentId: number;

    constructor(
        private activeRoute: ActivatedRoute,
        public navCtrl: NavController,
        private schoolService: SchoolService,
        private translate: TranslateService,
        private loadingCtrl: LoadingController,
        private accountService: AccountService,
        private modalCtrl: ModalController,
        private alertController: AlertController
    ) {
        this.currentLang = this.translate.currentLang;
        this.filtered = this.schoolService.filtered$.getValue();
        this.schoolService.filtered$.pipe(takeUntil(this.unsubscribe$))
            .subscribe((res: boolean) => {
                this.filtered = res;
            });
        this.schoolId = +this.activeRoute.snapshot.paramMap.get('id');
        this.appointmentId = +this.activeRoute.snapshot.queryParamMap.get('appointmentId');
        addIcons({ filterOutline });
    }

    ngOnInit() {}

    ionViewDidEnter() {
        if (!this.appointments || this.appointments.length === 0) {
            this.initialDataLoad();
        }
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    private async initialDataLoad() {
    const loading = await this.loadingCtrl.create({
        message: this.translate.instant('loading.loading')
    });
    await loading.present();

    try {
        this.currentUser = await firstValueFrom(this.accountService.currentUser());
        this.appointments = await firstValueFrom(
            this.schoolService.getAppointments({ limit: this.schoolService.defaultLimit }, this.schoolId)
        );
        
        this.appointments.forEach((appointment: Appointment) => {
            appointment.subscribed = appointment.subscriptions?.some((subscription: Subscription) =>
                subscription.user.email === this.currentUser.email
            );
        });

        // Reset infinite scroll state
        if (this.infiniteScroll) {
            this.infiniteScroll.disabled = false;
        }

        const appointmentToOpen = this.appointments.find((appointment: Appointment) => appointment.id == this.appointmentId);
        if (appointmentToOpen) {
            this.appointmentId = undefined;
            this.itemTapped(appointmentToOpen);
        }
    } catch (error) {
        console.error('Error loading appointments', error);
        // Optionally, you could show an error alert here
    } finally {
        await loading.dismiss();
    }
}

    async itemTapped(appointment: Appointment) {
        const modal = await this.modalCtrl.create({
            component: AppointmentDetailsComponent,
            componentProps: {
                appointment,
                currentUser: this.currentUser,
                schoolId: this.schoolId
            }
        });
        modal.present();
        const resp = await modal.onWillDismiss();
        if (resp.data.hasChange) {
            this.initialDataLoad();
        }
    }

    async subscriptionChange(event: CustomEvent, appointment: Appointment) {
        // console.log("subscriptionChange");
        // if (this.isDeadlinePassed(appointment)){
        //     const alert = await this.alertController.create({
        //         header: this.translate.instant('message.infotitle'),
        //         message: this.translate.instant('message.deadlinePassed'),
        //         buttons: [this.translate.instant('buttons.done')]
        //     });

        //     alert.present();
        // }
        if (event.detail.checked) {
            const alert = await this.alertController.create({
                header: this.translate.instant('message.infotitle'),
                message: this.translate.instant('message.subscription'),
                backdropDismiss: false,
                buttons: [
                    {
                        text: this.translate.instant('buttons.yes'),
                        handler: async () => {
                            const currentAppointment = await firstValueFrom(this.schoolService.subscribeToAppointment(this.schoolId, appointment.id));
                            await this.initialDataLoad();

                            const subscription = currentAppointment.subscriptions.find((subscription: Subscription) => subscription.user.email === this.currentUser.email);
                            if (subscription.waitingList) {
                                this.informWaitingList();
                            }
                        }
                    },
                    {
                        text: this.translate.instant('buttons.no'),
                        handler: () => {
                            this.initialDataLoad();
                        }
                    }
                ]
            });

            await alert.present();
        } else {
            let message: string;
            if (appointment.maxPeople && appointment.countWaitingList >= 0) {
                message = this.translate.instant('message.removeSubscriptionWaitingList');
            } else {
                message = this.translate.instant('message.removeSubscription');
            }

            const alert = await this.alertController.create({
                header: this.translate.instant('message.warning'),
                message: message,
                backdropDismiss: false,
                buttons: [
                    {
                        text: this.translate.instant('buttons.yes'),
                        handler: async () => {
                            await firstValueFrom(this.schoolService.deleteAppointmentSubscription(this.schoolId, appointment.id));
                            await this.initialDataLoad();
                        }
                    },
                    {
                        text: this.translate.instant('buttons.no'),
                        handler: () => {
                            this.initialDataLoad();
                        }
                    }
                ]
            });

            await alert.present();
        }
    }

    private async informWaitingList() {
        const alert = await this.alertController.create({
            header: this.translate.instant('message.infotitle'),
            message: this.translate.instant('message.watingList'),
            buttons: [this.translate.instant('buttons.done')]
        });

        alert.present();
    }

    loadData(event: any) {
        this.schoolService.getAppointments({
            limit: this.schoolService.defaultLimit,
            offset: this.appointments.length
        }, this.schoolId)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((res: Appointment[]) => {
                event.target.complete();
                if (res.length < this.schoolService.defaultLimit) {
                    event.target.disabled = true;
                }
                res.forEach((appointment: Appointment) => {
                    appointment.subscribed = appointment.subscriptions?.some((subscription: Subscription) =>
                        subscription.user.email === this.currentUser.email
                    );
                });
                this.appointments.push(...res);
            });
    }

    isToggleDisabled(appointment: Appointment): boolean {
        console.log("isToggleDisabled");
        if (new Date(appointment.scheduling).getTime() < new Date().getTime() || appointment.state == State.CANCELED) {
            return true;
        }

        return this.isDeadlinePassed(appointment);
    }

    isLineDisabled(appointment: Appointment): boolean {
        if (new Date(appointment.scheduling).getTime() < new Date().getTime() || appointment.state == State.CANCELED) {
            return true;
        }

        const isSubscribed = appointment.subscriptions?.some((subscription: Subscription) => subscription.user.email === this.currentUser.email);
        if (!isSubscribed && this.isDeadlinePassed(appointment)) {
            return true;
        }
        return false;
    }

    private isDeadlinePassed(appointment: Appointment): boolean {
        if (!appointment.deadline) {
            return false;
        }

        const deadlineWithoutTimezone = moment(moment.utc(appointment.deadline).format('YYYY-MM-DD HH:mm:ss'));
        const nowWithoutTimezone = moment(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
        return deadlineWithoutTimezone.isBefore(nowWithoutTimezone);
    }

    async openFilter() {
        const modal = await this.modalCtrl.create({
            component: AppointmentFilterComponent,
            cssClass: 'appointment-filter-class',
            componentProps: {
                infiniteScroll: this.infiniteScroll
            }
        });

        modal.present();
        const { role } = await modal.onWillDismiss();
        if (role == "filter" || role == "clear") {
            this.initialDataLoad();
        }
    }

}
