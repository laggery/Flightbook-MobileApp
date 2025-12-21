import { Component, OnDestroy, OnInit } from '@angular/core';
import { firstValueFrom, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import { AlertController, LoadingController, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import HttpStatusCode from '../../shared/util/HttpStatusCode';
import { v4 as uuidv4 } from 'uuid';
import { FileUploadService } from 'src/app/flight/shared/fileupload.service';
import { Flight } from '../shared/flight.model';
import { Glider } from 'src/app/glider/shared/glider.model';
import { FlightStore } from '../shared/flight.store';
import { GliderStore } from 'src/app/glider/shared/glider.store';
import { IgcService } from 'src/app/shared/services/igc.service';
import moment from 'moment';
import { FileInputComponent } from '../../shared/components/file-input/file-input.component';
import { FlightFormComponent } from '../../form/flight-form/flight-form';
import { School } from 'src/app/school/shared/school.model';
import { SchoolService } from 'src/app/school/shared/school.service';
import { FlightValidationState } from '../shared/flight-validation-state';
import { Place } from 'src/app/place/shared/place.model';

@Component({
    selector: 'app-flight-edit',
    templateUrl: './flight-edit.page.html',
    styleUrls: ['./flight-edit.page.scss'],
    imports: [
        FileInputComponent,
        FlightFormComponent,
        TranslateModule,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonBackButton,
        IonTitle,
        IonContent,
        IonButton
    ]
})
export class FlightEditPage implements OnInit, OnDestroy {
    unsubscribe$ = new Subject<void>();
    private readonly flightId: number;
    private initialFlight: Flight;
    private decoder = new TextDecoder('utf-8');
    public FlightValidationState = FlightValidationState;
    flight: Flight = new Flight();
    gliders: Glider[] = [];
    igcFile: string;
    schools: School[];

    constructor(
        private activeRoute: ActivatedRoute,
        private router: Router,
        private flightStore: FlightStore,
        private gliderStore: GliderStore,
        private alertController: AlertController,
        private translate: TranslateService,
        private loadingCtrl: LoadingController,
        private fileUploadService: FileUploadService,
        private igcService: IgcService,
        private schoolService: SchoolService
    ) {
        this.flightId = +this.activeRoute.snapshot.paramMap.get('id');
    }

    private async dataLoading() {
        const loading = await this.loadingCtrl.create({
            message: this.translate.instant('loading.loading')
        });
        await loading.present();
        this.initialFlight = this.flightStore.flights().find(flight => flight.id === this.flightId);

        try {
            if (!this.initialFlight) {
                this.initialFlight = await firstValueFrom(this.flightStore.getFlightById(this.flightId))
            }

            this.flight = _.cloneDeep(this.initialFlight);
            this.flight.date = moment(this.flight.date).format('YYYY-MM-DD');

            if (this.flight.time) {
                this.flight.time = this.flight.time.substring(0, 5);
            }

            if (!this.flight.start) {
                this.flight.start = new Place();
            }

            if (!this.flight.landing) {
                this.flight.landing = new Place();
            }

            const archivedValue = this.gliderStore.filter.archived;
            this.gliderStore.filter.archived = "0";
            this.gliderStore.getGliders({ store: false }).pipe(takeUntil(this.unsubscribe$)).subscribe((resp: Glider[]) => {
                this.gliders = resp;
                if (!this.gliders.find(glider => glider.id === this.flight.glider.id)) {
                    this.gliders.push(this.flight.glider);
                }
                this.gliderStore.filter.archived = archivedValue;
            });
            this.loadIgcData();

        } catch (error) {
            this.router.navigate(['/flights'], { replaceUrl: true });
        } finally {
            await loading.dismiss();
        }
    }

    ngOnInit() {
        this.dataLoading();
        this.schoolService.getSchools().then((schools: School[]) => {
            this.schools = schools;
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

        this.flightStore.putFlight(flight).pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: Flight) => {

            if (this.initialFlight?.date !== this.flight.date) {
                this.flightStore.getFlights({ limit: this.flightStore.defaultLimit, clearStore: true })
                    .pipe(takeUntil(this.unsubscribe$))
                    .subscribe(async (res: Flight[]) => {
                        await loading.dismiss();
                        await this.router.navigate(['/flights'], { replaceUrl: true });
                    });
            } else {
                await loading.dismiss();
                await this.router.navigate(['/flights'], { replaceUrl: true });
            }
        },
            (async (resp: any) => {
                await loading.dismiss();
                if (resp.status === HttpStatusCode.UNPROCESSABLE_ENTITY) {
                    const alert = await this.alertController.create({
                        header: this.translate.instant('message.infotitle'),
                        message: resp.error.message,
                        buttons: [this.translate.instant('buttons.done')]
                    });
                    await alert.present();
                }
            })
        );
    }

    async delete() {
        const loading = await this.loadingCtrl.create({
            message: this.translate.instant('loading.deleteflight')
        });
        await loading.present();

        this.flightStore.deleteFlight(this.flight).pipe(takeUntil(this.unsubscribe$)).subscribe({
            next: async () => {
                await loading.dismiss();
                await this.router.navigate(['/flights'], { replaceUrl: true });
            },
            error: (async (resp: any) => {
                await loading.dismiss();
            })
        });
    }

    async copy() {
        const loading = await this.loadingCtrl.create({
            message: this.translate.instant('loading.copyflight')
        });

        if (this.flight.igc) {
            const alert = await this.alertController.create({
                header: this.translate.instant('message.infotitle'),
                message: this.translate.instant('flight.copyIgc'),
                buttons: [
                    {
                        text: this.translate.instant('buttons.yes'),
                        handler: async () => {
                            await this.copyIgc(loading);
                            await this.postFlightRequest(loading);
                        }
                    },
                    {
                        text: this.translate.instant('buttons.no'),
                        handler: () => {
                            this.flight.igc = null;
                            loading.present();
                            this.postFlightRequest(loading);
                        }
                    }
                ]
            });
            await alert.present();
            await alert.onDidDismiss();
        } else {
            loading.present();
            this.postFlightRequest(loading);
        }
    }

    private postFlightRequest(loading: any) {
        this.flightStore.postFlight(this.flight).pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: Flight) => {
            await loading.dismiss();
            await this.router.navigate(['/flights'], { replaceUrl: true });
        },
            (async (resp: any) => {
                await loading.dismiss();
                if (resp.status === HttpStatusCode.UNPROCESSABLE_ENTITY) {
                    const alert = await this.alertController.create({
                        header: this.translate.instant('message.infotitle'),
                        message: resp.error.message,
                        buttons: [this.translate.instant('buttons.done')]
                    });
                    await alert.present();
                }
            })
        );
    }

    // @hack -> copyObject is not working on digitalocean
    private async copyIgc(loading: any) {
        await loading.present();
        const destinationFileName = `${uuidv4()}-${this.flight.igc.filepath.substring(37)}`;
        const file: File = new File([this.igcFile], destinationFileName);
        const formData = new FormData();
        formData.append('file', file, destinationFileName);
        try {
            const res = await this.fileUploadService.uploadFile(formData).toPromise();
            this.flight.igc.filepath = destinationFileName;
            return true;
        } catch (error) {
            this.flight.igc = null;
            const alert = await this.alertController.create({
                header: this.translate.instant('message.infotitle'),
                message: this.translate.instant('message.igcCopyError'),
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

        const override = await this.doOverride();

        await loading.present();

        this.igcFile = await this.igcService.getIgcFileContentAndPrefillFlight(this.flight, this.flight.igcFile, override);

        await loading.dismiss();
    }

    private async doOverride(): Promise<boolean> {
        let doOverride = false;
        const alert = await this.alertController.create({
            header: this.translate.instant('message.infotitle'),
            message: this.translate.instant('flight.override'),
            buttons: [
                {
                    text: this.translate.instant('buttons.yes'),
                    handler: () => {
                        doOverride = true;
                    }
                },
                this.translate.instant('buttons.no')

            ]
        });

        await alert.present();
        await alert.onDidDismiss();
        await alert.dismiss();
        return doOverride;
    }

    private async loadIgcData() {
        if (this.flight.igc && this.flight.igc.filepath) {
            this.fileUploadService.getFile(this.flight.igc.filepath).pipe(takeUntil(this.unsubscribe$)).subscribe(async blob => {
                const blobText = await blob.text();
                this.igcFile = this.decoder.decode(new Uint8Array(JSON.parse(blobText).data));
            })
        }
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
}
