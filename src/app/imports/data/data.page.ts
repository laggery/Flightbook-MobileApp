import { Component, OnDestroy, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subject, firstValueFrom, takeUntil } from 'rxjs';
import { FilePicker, PickedFile } from '@capawesome/capacitor-file-picker';
import { Encoding, Filesystem } from '@capacitor/filesystem';
import { FlightService } from 'src/app/flight/shared/flight.service';
import { GliderService } from 'src/app/glider/shared/glider.service';
import { PlaceService } from 'src/app/place/shared/place.service';
import { ImportService } from '../shared/import.service';
import { ImportType } from '../shared/import-type.model';

@Component({
  selector: 'app-data',
  templateUrl: './data.page.html',
  styleUrls: ['./data.page.scss'],
})
export class DataPage implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();

  isIos = false;
  file: File | undefined;
  result: any | undefined;
  showButton = true;

  importTypes: ImportType[] = [];
  currentType: ImportType;

  constructor(
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private translate: TranslateService,
    private importService: ImportService,
    private flightService: FlightService,
    private gliderService: GliderService,
    private placeService: PlaceService
  ) {
    if (Capacitor.getPlatform() == "ios") {
      this.isIos = true;
    }
    this.initialDataLoad();
  }

  ngOnInit() {
  }

  private async initialDataLoad() {
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.loading')
    });
    await loading.present();
    this.importService.getImportTypes().pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (res: ImportType[]) => {
        this.importTypes = res;
        this.currentType = this.importTypes[0];
      },
      async complete() {
        loading.dismiss();
      }
    });
  }

  changeImportType(event: CustomEvent) {
    this.currentType = this.importTypes.find(element => element.type === event.detail.value);
  
  }

  async onFilesSelect(event: any) {
    const file = event.target.files[0];
    const fileType = file.name.slice(-3);
    if (fileType.toLowerCase() != "csv") {
      const alert = await this.alertController.create({
        header: this.translate.instant('message.infotitle'),
        message: this.translate.instant('message.wrongCsvFileType'),
        buttons: [this.translate.instant('buttons.done')]
      });
      await alert.present();
      return;
    }
    this.file = event.target.files[0];
  }

  async onIosFilesSelect() {
    const result = await FilePicker.pickFiles({
      multiple: false,
      readData: true
    });

    if ((result.files[0] as PickedFile).name.slice(-3).toLowerCase() != "csv") {
      const alert = await this.alertController.create({
        header: this.translate.instant('message.infotitle'),
        message: this.translate.instant('message.wrongCsvFileType'),
        buttons: [this.translate.instant('buttons.done')]
      });
      await alert.present();
      return;
    }

    const contents = await Filesystem.readFile({
      path: result.files[0].path,
      encoding: Encoding.UTF8,
    });

    this.file = new File([new Blob([contents.data])], result.files[0].name);
  }

  async save() {
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.loading')
    });
    await loading.present();

    const formData = new FormData();
    formData.append('file', this.file);

    this.showButton = false;
    try {
      const result = await firstValueFrom(this.importService.importData(formData, this.currentType.type));
      this.result = result;
      this.flightService.setState([]);
      this.gliderService.setState([]);
      this.placeService.setState([]);
    } catch (error) {
      const alert = await this.alertController.create({
        header: this.translate.instant('message.errortitle'),
        message: this.translate.instant('message.uploadError'),
        backdropDismiss: false,
        buttons: [
          {
            text: this.translate.instant('buttons.done'),
          }
        ]
      });
      await alert.present();
    }
    await loading.dismiss();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
