import { Component, Input, OnInit } from '@angular/core';
import { IonInfiniteScroll, ModalController, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonSelect, IonSelectOption, IonButton, IonModal, IonDatetime } from '@ionic/angular/standalone';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AppointmentFilter } from '../../appointment-filter.model';
import { SchoolService } from '../../school.service';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'fb-appointment-filter',
    templateUrl: './appointment-filter.component.html',
    styleUrls: ['./appointment-filter.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        DatePipe,
        TranslateModule,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonItem,
        IonInput,
        IonSelect,
        IonSelectOption,
        IonButton,
        IonModal,
        IonDatetime
    ],
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

    ngOnInit() { }

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
