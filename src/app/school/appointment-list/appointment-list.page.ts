import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { AccountService } from 'src/app/account/shared/account.service';
import { User } from 'src/app/account/shared/user.model';
import { Appointment } from '../shared/appointment.model';
import { SchoolService } from '../shared/school.service';
import { Subscription } from '../shared/subscription.model';

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
    private accountService: AccountService) {
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

  itemTapped(event: MouseEvent, applointment: Appointment) {
    console.log("appointment click");
  }

  subscriptionClick(event: MouseEvent) {
    event.stopPropagation();
  }

  subscriptionChange(event: CustomEvent, appointment: Appointment) {
    console.log(event.detail.checked);
    if (event.detail.checked) {
      firstValueFrom(this.schoolService.subscribeToAppointment(this.schoolId, appointment.id));
    } else {
      firstValueFrom(this.schoolService.deleteAppointmentSubscription(this.schoolId, appointment.id));
    }
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

}
