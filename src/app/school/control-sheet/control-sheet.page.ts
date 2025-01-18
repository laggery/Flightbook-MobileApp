import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ControlSheet } from 'src/app/shared/domain/control-sheet';
import { SchoolService } from '../shared/school.service';
import { Subject, takeUntil } from 'rxjs';
import { IonModal, LoadingController, ModalController, IonicModule } from '@ionic/angular';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ControlSheetDetailsComponent } from '../shared/components/control-sheet-details/control-sheet-details.component';
import { NxgTransalteSortPipe } from 'src/app/shared/pipes/nxg-transalte-sort.pipe';
import { NgFor, NgIf } from '@angular/common';
import { StarRatingComponent } from '../../shared/components/star-rating/star-rating.component';

type StarRating = {
  currentValue: number,
  translationKey: string,
  type: string,
  key: string
}

@Component({
    selector: 'app-control-sheet',
    templateUrl: './control-sheet.page.html',
    styleUrls: ['./control-sheet.page.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NgFor,
        NgIf,
        StarRatingComponent,
        TranslateModule,
    ],
})
export class ControlSheetPage implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  controlSheet: ControlSheet | undefined;
  @ViewChild('starModal') starModal: IonModal;

  // Star rating
  starRating: StarRating;

  orderedAltitudeFlight: any[] = [];
  orderedTheory: any[] = [];
  orderedTrainingHill: any[] = [];

  constructor(
    private schoolService: SchoolService,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private translate: TranslateService,
    private nxgTransalteSortPipe: NxgTransalteSortPipe
    ) {}
  
  ngOnInit() {
    this.initialDataLoad();
  }

  private async initialDataLoad() {
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.loading')
    });
    await loading.present();
    this.schoolService.getControlSheet().pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: async (controlSheet: ControlSheet) => {
        this.controlSheet = controlSheet;
        this.orderControlSheet(controlSheet);
        await loading.dismiss();
      },
      error: async (error: any) => {
        await loading.dismiss();
      }
    });
  }

  private orderControlSheet(controlSheet: ControlSheet) {
    this.orderedAltitudeFlight = Object.keys(controlSheet.altitudeFlight).map(key => {
      return {
        key: key,
        value: controlSheet.altitudeFlight[key]
      }
    });
    this.nxgTransalteSortPipe.transform(this.orderedAltitudeFlight, 'altitudeFlight');

    this.orderedTheory = Object.keys(controlSheet.theory).map(key => {
      return {
        key: key,
        value: controlSheet.theory[key]
      }
    });

    this.orderedTrainingHill = Object.keys(controlSheet.trainingHill).map(key => {
      return {
        key: key,
        value: controlSheet.trainingHill[key]
      }
    });
    this.nxgTransalteSortPipe.transform(this.orderedTrainingHill, 'trainingHill');
  }

  async openDetail(type: string, key: string) {
    const modal = await this.modalCtrl.create({
      component: ControlSheetDetailsComponent,
      cssClass: 'control-sheet-detail-class',
      componentProps: {
        type: type,
        key: key
      }
    });

    return await modal.present();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async openRateAlert(event: MouseEvent, currentRating: number, translationKey: string, type: any, key: string) {
    event.stopPropagation();
    if (!this.controlSheet.userCanEdit) {
      return
    }
    
    this.starRating = {
      currentValue: currentRating,
      translationKey: translationKey,
      type: type,
      key: key
    }
    this.starModal.present();
  }

  async saveRating(value: number) {
    let index;
    switch (this.starRating.type) {
      case 'trainingHill':
        this.controlSheet.trainingHill[this.starRating.key] = value;
        index = this.orderedTrainingHill.findIndex((item: any) => item.key === this.starRating.key)
        this.orderedTrainingHill[index] = {
          key: this.starRating.key,
          value: value
        };
        break;
      case 'theory':
        this.controlSheet.theory[this.starRating.key] = value;
        index = this.orderedTheory.findIndex((item: any) => item.key === this.starRating.key)
        this.orderedTheory[index] = {
          key: this.starRating.key,
          value: value
        };
        break;
      case 'altitudeFlight':
        this.controlSheet.altitudeFlight[this.starRating.key] = value;
        index = this.orderedAltitudeFlight.findIndex((item: any) => item.key === this.starRating.key)
        this.orderedAltitudeFlight[index] = {
          key: this.starRating.key,
          value: value
        };
        break;
    }

    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.loading')
    });
    await loading.present();
    this.schoolService.postControlSheet(this.controlSheet).pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: async (res: ControlSheet) => {
        await loading.dismiss();
      },
      error: (async (resp: any) => {
        await loading.dismiss();
        this.initialDataLoad();
        this.starModal.dismiss();
      })
    });
  }
}
