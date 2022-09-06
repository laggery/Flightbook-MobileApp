import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { AccountService } from 'src/app/account/shared/account.service';
import { User } from 'src/app/account/shared/user.model';
import { Appointment } from '../shared/appointment.model';
import { SchoolService } from '../shared/school.service';
import { Subscription } from '../shared/subscription.model';
import { AppointmentDetailsComponent } from './components/appointment-details/appointment-details.component';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.page.html',
  styleUrls: ['./appointment-list.page.scss'],
})
export class AppointmentListPage implements OnInit {
  unsubscribe$ = new Subject<void>();
  limit = 50;
  appointments: Appointment[];
  currentUser: User;
  private readonly schoolId: number;

  constructor(
    private activeRoute: ActivatedRoute,
    public navCtrl: NavController,
    private schoolService: SchoolService,
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private accountService: AccountService,
    private modalCtrl: ModalController,
    private alertController: AlertController) {
    this.schoolId = +this.activeRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.initialDataLoad();
  }

  private async initialDataLoad() {
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.loading')
    });
    await loading.present();

    this.currentUser = await firstValueFrom(this.accountService.currentUser());

    this.schoolService.getAppointments({ limit: this.limit }, this.schoolId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(async (res: Appointment[]) => {
        this.appointments = res;
        await loading.dismiss();
      }, async (error: any) => {
        await loading.dismiss();
      });
  }

  async itemTapped(event: MouseEvent, appointment: Appointment) {
    const modal = await this.modalCtrl.create({
      component: AppointmentDetailsComponent,
      componentProps: {
        appointment
      }
    });
    modal.present();
    await modal.onWillDismiss();
  }

  subscriptionClick(event: MouseEvent) {
    event.stopPropagation();
  }

  async subscriptionChange(event: CustomEvent, appointment: Appointment) {
    if (event.detail.checked) {
      firstValueFrom(this.schoolService.subscribeToAppointment(this.schoolId, appointment.id));
      this.initialDataLoad();
      if (appointment.maxPeople && appointment.subscriptions.length == appointment.maxPeople) {
        this.informWaitingList();
      }
    } else {
      if (appointment.maxPeople && appointment.subscriptions.length > appointment.maxPeople) {
        const alert = await this.alertController.create({
          header: this.translate.instant('message.warning'),
          message: this.translate.instant('message.removeSubscription'),
          backdropDismiss: false,
          buttons: [
            {
              text: this.translate.instant('buttons.yes'),
              handler: () => {
                firstValueFrom(this.schoolService.deleteAppointmentSubscription(this.schoolId, appointment.id));
                this.initialDataLoad();
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
        firstValueFrom(this.schoolService.deleteAppointmentSubscription(this.schoolId, appointment.id));
        this.initialDataLoad();
      }
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

  isUserSubscribed(appointment: Appointment) {
    const subscribed = appointment.subscriptions?.find((subscription: Subscription) => {
      if (subscription.user.email == this.currentUser.email) {
        return true;
      }
    })
    if (subscribed) {
      return true;
    }
    return false;
  }

  isPassedAppointment(appointment: Appointment) {
    if (new Date(appointment.scheduling).getTime() < new Date().getTime()) {
      return true;
    }
    return false;
  }

}
