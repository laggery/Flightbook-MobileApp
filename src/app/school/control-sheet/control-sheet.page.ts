import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ControlSheet } from 'src/app/shared/domain/control-sheet';
import { SchoolService } from '../shared/school.service';
import { Subject, concatMap, takeUntil } from 'rxjs';
import { IonModal, LoadingController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ControlSheetDetailsComponent } from '../shared/components/control-sheet-details/control-sheet-details.component';

type StarRating = {
  currentValue: number,
  translationKey: string,
  type: any,
  key: string
}

@Component({
  selector: 'app-control-sheet',
  templateUrl: './control-sheet.page.html',
  styleUrls: ['./control-sheet.page.scss'],
})
export class ControlSheetPage implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  controlSheet: ControlSheet | undefined;
  @ViewChild('starModal') starModal: IonModal;

  // Star rating
  starRating: StarRating;

  constructor(
    private schoolService: SchoolService,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private translate: TranslateService
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
        await loading.dismiss();
      },
      error: async (error: any) => {
        await loading.dismiss();
      }
    });
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
    this.starRating.type[this.starRating.key] = value;

    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.loading')
    });
    await loading.present();
    this.schoolService.postControlSheet(this.controlSheet).pipe(
      concatMap(() => this.schoolService.getControlSheet())
    ).pipe(takeUntil(this.unsubscribe$)).subscribe({
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
