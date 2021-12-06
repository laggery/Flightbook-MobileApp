import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Flight, Glider, GliderService, IgcService, Place, FileUploadService, FlightService } from 'flightbook-commons-library';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-multiple-igc',
  templateUrl: './multiple-igc.page.html',
  styleUrls: ['./multiple-igc.page.scss'],
})
export class MultipleIgcPage implements OnInit {

  unsubscribe$ = new Subject<void>();
  gliders: Glider[] = [];
  state = State;
  flightStateList: FlightStatus[] = [];
  isSaved = false;

  constructor(
    private gliderService: GliderService,
    private igcService: IgcService,
    private loadingCtrl: LoadingController,
    private translate: TranslateService,
    private fileUploadService: FileUploadService,
    private flightService: FlightService
  ) {
  }

  ngOnInit() {
    if (this.gliderService.isGliderlistComplete) {
      this.gliders = this.gliderService.getValue();
    } else {
      this.gliderService.getGliders({ clearStore: true }).pipe(takeUntil(this.unsubscribe$)).subscribe((resp: Glider[]) => {
        this.gliderService.isGliderlistComplete = true;
        this.gliders = this.gliderService.getValue();
      });
    }
  }

  async onFilesSelectEvent($event: File[]) {
    for await(const file of $event) {
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

    for await(const flightSate of this.flightStateList) {
      try {
        if (flightSate.flight.igcFile) {
          await this.uploadIgc(flightSate.flight);
        }

        await this.flightService.postFlight(flightSate.flight).toPromise();

        flightSate.state = State.SAVED;
      } catch {
        flightSate.state = State.ERROR;
      }
    }
    this.isSaved = true;
    await loading.dismiss();
  }

  private async uploadIgc(flight: Flight) {
    const formData = new FormData();
    formData.append('file', flight.igcFile, flight.igcFile.name);
    const res = await this.fileUploadService.uploadFile(formData).toPromise();
    flight.igc.filepath = flight.igcFile.name;
  }

  clear(){
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
