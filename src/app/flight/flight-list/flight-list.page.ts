import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { NavController, ModalController, IonInfiniteScroll, IonContent, LoadingController } from '@ionic/angular';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlightFilterComponent } from 'src/app/form/flight-filter/flight-filter.component';
import { TranslateService } from '@ngx-translate/core';
import { AccountService, Flight, FlightService, PdfExportService, XlsxExportService } from 'flightbook-commons-library';
import { TCreatedPdf } from 'pdfmake/build/pdfmake';
import { FileOpener } from '@ionic-native/file-opener/ngx';

import { Capacitor, FilesystemDirectory, Plugins } from '@capacitor/core';
const { Filesystem } = Plugins;

@Component({
  selector: 'app-flight-list',
  templateUrl: './flight-list.page.html',
  styleUrls: ['./flight-list.page.scss'],
})
export class FlightListPage implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent) content: IonContent;
  unsubscribe$ = new Subject<void>();
  flights$: Observable<Flight[]>;
  filtered: boolean;

  constructor(
    public navCtrl: NavController,
    private flightService: FlightService,
    private accountService: AccountService,
    private modalCtrl: ModalController,
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private xlsxExportService: XlsxExportService,
    private pdfExportService: PdfExportService,
    private fileOpener: FileOpener
  ) {
    this.flights$ = this.flightService.getState();
    this.filtered = this.flightService.filtered$.getValue();
    this.flightService.filtered$.pipe(takeUntil(this.unsubscribe$)).subscribe((value: boolean) => {
      this.filtered = value;
    })

    if (this.flightService.getValue().length === 0) {
      this.initialDataLoad();
    }
  }

  private async initialDataLoad() {
    let loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.loading')
    });
    await loading.present();
    this.flightService.getFlights({ limit: this.flightService.defaultLimit }).pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: Flight[]) => {
      // @hack for hide export item
      setTimeout(async () => {
        this.content.scrollToPoint(0, 48);
        await loading.dismiss();
      }, 1);
    }, async (error: any) => {
      await loading.dismiss();
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.content.scrollToPoint(0, 48);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadData(event: any) {
    this.flightService.getFlights({ limit: this.flightService.defaultLimit, offset: this.flightService.getValue().length })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: Flight[]) => {
        event.target.complete();
        if (res.length < this.flightService.defaultLimit) {
          event.target.disabled = true;
        }
      });
  }

  itemTapped(event: MouseEvent, flight: Flight) {
    this.navCtrl.navigateForward(`flights/${flight.id}`);
  }

  async openFilter() {
    const modal = await this.modalCtrl.create({
      component: FlightFilterComponent,
      cssClass: 'flight-filter-class',
      componentProps: {
        'infiniteScroll': this.infiniteScroll,
        'type': "FlightListPage"
      }
    });

    this.modalOnDidDismiss(modal);

    return await modal.present();
  }

  async modalOnDidDismiss(modal: HTMLIonModalElement) {
    modal.onDidDismiss().then((resp: any) => {
      this.content.scrollToPoint(0, 48);
    })
  }

  xlsxExport() {
    this.flightService.getFlights({ store: false }).pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: Flight[]) => {
      res = res.sort((a: Flight, b: Flight) => b.number - a.number);
      this.xlsxExportService.exportFlights("flights", res);
    });
  }

  pdfExport() {
    this.flightService.getFlights({ store: false }).pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: Flight[]) => {
      res = res.sort((a: Flight, b: Flight) => b.number - a.number);
      res.reverse();
      let user = await this.accountService.currentUser().pipe(takeUntil(this.unsubscribe$)).toPromise();
      const pdfObj: TCreatedPdf = this.pdfExportService.generatePdf(res, user);
      if (Capacitor.isNative) {
        pdfObj.getBase64(async(data) => {
          try {
            let path = `pdf/flightbook_${Date.now()}.pdf`;

            const result = await Filesystem.writeFile({
              path,
              data,
              directory: FilesystemDirectory.Documents,
              recursive: true
            });
            this.fileOpener.open(`${result.uri}`, 'application/pdf');
          } catch (e) {
            console.error("Unable to write file", e)
          }
        });
      } else {
        pdfObj.open();
      }
      
    });
  }
}
