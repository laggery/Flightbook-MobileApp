import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController, LoadingController, AlertController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import HttpStatusCode from '../../shared/util/HttpStatusCode';
import { AccountService } from 'src/app/core/services/account.service';
import { User } from 'src/app/core/domain/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  registerData: User;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private menuCtrl: MenuController,
    private accountService: AccountService,
    private loadingCtrl: LoadingController,
    private alertController: AlertController
  ) {
    this.menuCtrl.enable(false);
    this.registerData = new User();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async saveRegister(registerForm: any) {
    if (registerForm.valid) {
      const loading = await this.loadingCtrl.create({
        message: this.translate.instant('loading.createaccount')
      });
      await loading.present();
      this.accountService.register(this.registerData).pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: User) => {
        await loading.dismiss();
        await this.router.navigate(['/login'], { replaceUrl: true });
      },
        (async (error: any) => {
          await loading.dismiss();
          if (error.status === HttpStatusCode.CONFLICT) {
            const alert = await this.alertController.create({
              header: this.translate.instant('account.register'),
              message: this.translate.instant('message.userExist'),
              buttons: [this.translate.instant('buttons.done')]
            });
            await alert.present();
          }
        })
      );
    }
  }

}
