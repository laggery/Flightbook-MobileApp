import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { User } from 'src/app/account/shared/user.model';
import { Appointment } from 'src/app/school/shared/appointment.model';
import { Subscription } from 'src/app/school/shared/subscription.model';
import { SchoolService } from '../../school.service';
import { State } from '../../state';

@Component({
  selector: 'fb-appointment-details',
  templateUrl: './appointment-details.component.html',
  styleUrls: ['./appointment-details.component.scss'],
})
export class AppointmentDetailsComponent implements OnInit {

  appointment: Appointment;
  currentUser: User;
  currentLang: string;
  schoolId: number;
  isSubscribed = false;
  subscribed: Subscription[] = [];
  waitingList: Subscription[] = [];
  hasChanges = false;

  constructor(
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private translate: TranslateService,
    private schoolService: SchoolService
  ) {
    this.currentLang = this.translate.currentLang;
  }

  ngOnInit() {
    this.subscribed = [];
    this.waitingList = [];
    this.isUserSubscribed();
    if (this.appointment.maxPeople) {
      this.appointment.subscriptions.forEach((subscription: Subscription) => {
        if (subscription.waitingList) {
          this.waitingList.push(subscription);
        } else {
          this.subscribed.push(subscription);
        }
      })
    } else {
      this.subscribed = this.appointment.subscriptions;
    }
  }

  async subscribe() {
    if (!this.isSubscribed) {
      const alert = await this.alertController.create({
        header: this.translate.instant('message.infotitle'),
        message: this.translate.instant('message.subscription'),
        backdropDismiss: false,
        buttons: [
          {
            text: this.translate.instant('buttons.yes'),
            handler: async () => {
              await firstValueFrom(this.schoolService.subscribeToAppointment(this.schoolId, this.appointment.id));
              this.appointment = await firstValueFrom(this.schoolService.getAppointment(this.schoolId, this.appointment.id));
              this.hasChanges = true;
              this.ngOnInit();
              const subscription = this.appointment.subscriptions.find((subscription: Subscription) => subscription.user.email === this.currentUser.email);
              if (subscription.waitingList) {
                this.informWaitingList();
              }
              this.isSubscribed = true;
            }
          },
          {
            text: this.translate.instant('buttons.no'),
            handler: () => {
              this.isSubscribed = false;
            }
          }
        ]
      });

      await alert.present();
    } else {
      let message: string;
      if (this.appointment.maxPeople && this.appointment.countWaitingList >= 0) {
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
              await firstValueFrom(this.schoolService.deleteAppointmentSubscription(this.schoolId, this.appointment.id));
              this.appointment = await firstValueFrom(this.schoolService.getAppointment(this.schoolId, this.appointment.id));
              this.ngOnInit();
              this.isSubscribed = false;
              this.hasChanges = true;
            }
          },
          {
            text: this.translate.instant('buttons.no'),
            handler: () => {
              this.isSubscribed = true;
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

  isUserSubscribed() {
    this.isSubscribed = this.appointment.subscriptions?.some((subscription: Subscription) =>
      subscription.user.email === this.currentUser.email
    );
  }

  isDisabled() {
    if (new Date(this.appointment.scheduling).getTime() < new Date().getTime() || this.appointment.state == State.CANCELED) {
      return true;
    }
    return false;
  }

  close() {
    return this.modalCtrl.dismiss({ hasChange: this.hasChanges });
  }

}
