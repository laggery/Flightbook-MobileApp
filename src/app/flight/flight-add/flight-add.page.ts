import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AlertController, LoadingController, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent } from '@ionic/angular/standalone';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import HttpStatusCode from '../../shared/util/HttpStatusCode';
import { FileUploadService } from 'src/app/flight/shared/fileupload.service';
import { Place } from 'src/app/place/shared/place.model';
import { Flight } from '../shared/flight.model';
import { Glider } from 'src/app/glider/shared/glider.model';
import { FlightStore } from '../shared/flight.store';
import { GliderService } from 'src/app/glider/shared/glider.service';
import { IgcService } from 'src/app/shared/services/igc.service';
import moment from 'moment';
import { FileInputComponent } from '../../shared/components/file-input/file-input.component';
import { FlightFormComponent } from '../../form/flight-form/flight-form';
import { SchoolService } from 'src/app/school/shared/school.service';
import { School } from 'src/app/school/shared/school.model';

@Component({
    selector: 'app-flight-add',
    templateUrl: './flight-add.page.html',
    styleUrls: ['./flight-add.page.scss'],
    imports: [
        FileInputComponent,
        FlightFormComponent,
        TranslateModule,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonMenuButton,
        IonTitle,
        IonContent
    ]
})
export class FlightAddPage implements OnInit, OnDestroy {
    unsubscribe$ = new Subject<void>();
    flight: Flight;
    gliders: Glider[] = [];
    igcFile: string;
    schools: School[];

    constructor(
        private router: Router,
        private flightStore: FlightStore,
        private gliderService: GliderService,
        private alertController: AlertController,
        private translate: TranslateService,
        private loadingCtrl: LoadingController,
        private fileUploadService: FileUploadService,
        private schoolService: SchoolService,
        private igcService: IgcService
    ) {
        this.flight = new Flight();
        this.flight.date = moment().format('YYYY-MM-DD');
        this.flight.glider = new Glider();
        this.flight.start = new Place();
        this.flight.landing = new Place();
    }

    ngOnInit() {
        this.schoolService.getSchools().then((schools: School[]) => {
            this.schools = schools;
        });
        
        // Use the store directly to get flights
        const currentFlights = this.flightStore.flights();
        if (currentFlights.length > 0) {
            this.flight.glider = currentFlights[0].glider;
        } else {
            this.flightStore.getFlights({ limit: 1, store: false })
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe((res: Flight[]) => {
                    if (res.length > 0) {
                        this.flight.glider = res[0].glider;
                    }
                });
        }

        const archivedValue = this.gliderService.filter.archived;
        this.gliderService.filter.archived = "0";
        this.gliderService.getGliders({ store: false }).pipe(takeUntil(this.unsubscribe$)).subscribe((resp: Glider[]) => {
            this.gliders = resp;
            this.gliderService.filter.archived = archivedValue;
            this.noGliderCheck();
        });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    async saveFlight(flight: Flight) {
        const loading = await this.loadingCtrl.create({
            message: this.translate.instant('loading.saveflight')
        });
        await loading.present();

        if (flight.igcFile) {
            await this.uploadIgc(flight, loading);
        }

        // Use the store directly to post the flight
        // The store will automatically refresh the flights list
        this.flightStore.postFlight(flight).pipe(takeUntil(this.unsubscribe$)).subscribe({
            next: async (res: Flight) => {
                await loading.dismiss();
                // Navigate back to the flights list and ensure it's refreshed
                await this.router.navigate(['/flights'], { replaceUrl: true });
            },
            error: async (resp: any) => {
                await loading.dismiss();
                if (resp.status === HttpStatusCode.UNPROCESSABLE_ENTITY) {
                    const alert = await this.alertController.create({
                        header: this.translate.instant('message.infotitle'),
                        message: resp.error.message,
                        buttons: [this.translate.instant('buttons.done')]
                    });
                    await alert.present();
                }
            }
        });
    }

    private async uploadIgc(flight: Flight, loading: any) {
        try {
            const res = await this.fileUploadService.getPresignedUploadUrl(flight.igcFile.name).toPromise();
            await this.fileUploadService.uploadFileToS3(res.url, flight.igcFile).toPromise();
            flight.igc.filepath = flight.igcFile.name;
            return true;
        } catch (error) {
            const alert = await this.alertController.create({
                header: this.translate.instant('message.infotitle'),
                message: this.translate.instant('message.igcUploadError'),
                buttons: [this.translate.instant('buttons.done')]
            });
            loading.dismiss();
            await alert.present();
            await alert.onDidDismiss();
            await loading.present();
            return false;
        }
    }

    async onFilesSelectEvent($event: File[]) {
        this.flight.igcFile = $event[0];
        const loading = await this.loadingCtrl.create({
            message: this.translate.instant('loading.igcRead')
        });

        await loading.present();

        this.igcFile = await this.igcService.getIgcFileContentAndPrefillFlight(this.flight, this.flight.igcFile);
        const glider = this.gliders.find(glider => glider.id === this.flight.glider.id);
        if (!glider) {
            this.gliders.push(this.flight.glider);
        }

        await loading.dismiss();
    }

    private async noGliderCheck() {
        if (this.gliders.length === 0) {
            const alert = await this.alertController.create({
                header: this.translate.instant('message.noglidertitle'),
                message: this.translate.instant('message.noglider'),
                buttons: [this.translate.instant('buttons.done')]
            });

            await alert.present();
            await this.router.navigate(['/gliders/add'], { replaceUrl: true });
        }
    }
}
