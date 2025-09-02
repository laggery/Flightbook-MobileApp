import { Component, OnInit } from '@angular/core';
import { LoadingController, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonList, IonItem, IonSpinner, IonButton, IonIcon } from '@ionic/angular/standalone';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Place } from 'src/app/place/shared/place.model';
import { FileUploadService } from 'src/app/flight/shared/fileupload.service';
import { Glider } from 'src/app/glider/shared/glider.model';
import { GliderStore } from 'src/app/glider/shared/glider.store';
import { IgcService } from 'src/app/shared/services/igc.service';
import { FlightStore } from 'src/app/flight/shared/flight.store';
import { Flight } from 'src/app/flight/shared/flight.model';
import { FileInputComponent } from '../../shared/components/file-input/file-input.component';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { GliderSelectComponent } from '../../shared/components/glider-select/glider-select.component';
import { addIcons } from "ionicons";
import { trashOutline, cloudDoneOutline, alert } from "ionicons/icons";

@Component({
    selector: 'app-multiple-igc',
    templateUrl: './multiple-igc.page.html',
    styleUrls: ['./multiple-igc.page.scss'],
    imports: [
        FileInputComponent,
        NgIf,
        NgFor,
        GliderSelectComponent,
        DatePipe,
        TranslateModule,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonMenuButton,
        IonTitle,
        IonContent,
        IonList,
        IonItem,
        IonSpinner,
        IonButton,
        IonIcon
    ]
})
export class MultipleIgcPage implements OnInit {

    unsubscribe$ = new Subject<void>();
    gliders: Glider[] = [];
    state = State;
    flightStateList: FlightStatus[] = [];
    isSaved = false;

    constructor(
        private gliderStore: GliderStore,
        private igcService: IgcService,
        private loadingCtrl: LoadingController,
        private translate: TranslateService,
        private fileUploadService: FileUploadService,
        private flightStore: FlightStore
    ) {
        addIcons({ trashOutline, cloudDoneOutline, alert });
    }

    ngOnInit() {
        if (this.gliderStore.isGliderlistComplete) {
            this.gliders = this.gliderStore.gliders();
        } else {
            this.gliderStore.getGliders({ clearStore: true }).pipe(takeUntil(this.unsubscribe$)).subscribe((resp: Glider[]) => {
                this.gliderStore.isGliderlistComplete = true;
                this.gliders = this.gliderStore.gliders();
            });
        }
    }

    async onFilesSelectEvent($event: File[]) {
        for await (const file of $event) {
            const flight = this.initFlight();
            let flightState = {
                flight: flight,
                state: State.LOADING
            };

            this.flightStateList.push(flightState);

            flight.igcFile = file;

            await this.igcService.getIgcFileContentAndPrefillFlight(flight, flight.igcFile);

            if (!flight.glider.name) {
                flight.glider = this.gliders[0];
            }

            flightState.state = State.LOADED;
        }
    }

    private initFlight(): Flight {
        const flight = new Flight();
        flight.glider = new Glider();
        flight.start = new Place();
        flight.landing = new Place();
        return flight;
    }

    removeFlight(index: number) {
        this.flightStateList.splice(index, 1);
    }

    async save() {
        const loading = await this.loadingCtrl.create({
            message: this.translate.instant('loading.saveflight')
        });
        await loading.present();

        for await (const flightSate of this.flightStateList) {
            try {
                if (flightSate.flight.igcFile) {
                    await this.uploadIgc(flightSate.flight);
                }

                await this.flightStore.postFlight(flightSate.flight).toPromise();

                flightSate.state = State.SAVED;
            } catch {
                flightSate.state = State.ERROR;
            }
        }
        this.isSaved = true;
        await loading.dismiss();
    }

    private async uploadIgc(flight: Flight) {
        const res = await this.fileUploadService.getPresignedUploadUrl(flight.igcFile.name).toPromise();
        await this.fileUploadService.uploadFileToS3(res.url, flight.igcFile).toPromise();
        flight.igc.filepath = flight.igcFile.name;
    }

    clear() {
        this.flightStateList = [];
        this.isSaved = false;
    }
}

interface FlightStatus {
    flight: Flight,
    state: State
}

enum State {
    SAVED,
    ERROR,
    LOADED,
    LOADING
}
