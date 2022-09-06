import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Appointment } from 'src/app/school/shared/appointment.model';
import { Subscription } from 'src/app/school/shared/subscription.model';

@Component({
  selector: 'fb-appointment-details',
  templateUrl: './appointment-details.component.html',
  styleUrls: ['./appointment-details.component.scss'],
})
export class AppointmentDetailsComponent implements OnInit {

  appointment: Appointment;
  subscribed: Subscription[] = [];
  waitingList: Subscription[] = [];

  constructor(
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    if (this.appointment.maxPeople) {
      this.appointment.subscriptions.forEach((subscription: Subscription) => {
        if (this.appointment.maxPeople && this.subscribed.length != this.appointment.maxPeople) {
          this.subscribed.push(subscription);
        } else {
          this.waitingList.push(subscription);
        }
      })
    } else {
      this.subscribed = this.appointment.subscriptions;
    }
    
  }

  close() {
    return this.modalCtrl.dismiss();
  }

}
