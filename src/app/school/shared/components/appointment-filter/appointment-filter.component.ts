import { Component, Input, OnInit } from '@angular/core';
import { IonInfiniteScroll, LoadingController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { AppointmentFilter } from '../../appointment-filter.model';
import { Appointment } from '../../appointment.model';
import { SchoolService } from '../../school.service';

@Component({
  selector: 'fb-appointment-filter',
  templateUrl: './appointment-filter.component.html',
  styleUrls: ['./appointment-filter.component.scss'],
})
export class AppointmentFilterComponent implements OnInit {
  @Input() infiniteScroll: IonInfiniteScroll;
  filter: AppointmentFilter;
  language

  constructor(
    private schoolService: SchoolService,
    private translate: TranslateService,
    private modalCtrl: ModalController
  ) {
    this.filter = this.schoolService.filter;
    this.language = translate.currentLang;
  }

  ngOnInit() {}

  filterElement() {
    this.schoolService.filter = this.filter;
    this.modalCtrl.dismiss(null, 'filter');
  }

  clearFilter() {
    this.filter = new AppointmentFilter();
    this.schoolService.filter = this.filter;
    this.modalCtrl.dismiss(null, 'clear');
  }


  clearDateButton(type: string) {
    if (type === 'from') {
      this.filter.from = null;
    } else {
      this.filter.to = null;
    }
  }

}
