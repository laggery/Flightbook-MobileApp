import { Component, OnDestroy, OnInit } from '@angular/core';
import { ControlSheet } from 'src/app/shared/domain/control-sheet';
import { SchoolService } from '../shared/school.service';
import { Subject, takeUntil } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-control-sheet',
  templateUrl: './control-sheet.page.html',
  styleUrls: ['./control-sheet.page.scss'],
})
export class ControlSheetPage implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  controlSheet: ControlSheet | undefined;

  constructor(
    private schoolService: SchoolService,
    private loadingCtrl: LoadingController,
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

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
