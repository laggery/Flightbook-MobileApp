import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from '../account.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password',
  templateUrl: './password.page.html',
  styleUrls: ['./password.page.scss'],
})
export class PasswordPage implements OnInit {
  pwd: any;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private accountService: AccountService,
    private alertController: AlertController,
    private loadingCtrl: LoadingController
  ) {
    this.pwd = {
      oldPassword: "",
      newPassword: "",
      newPassword2: ""
    }
  }

  ngOnInit() {
  }

  async savePassword() {
    if (this.pwd.newPassword !== this.pwd.newPassword2) {
      const alert = await this.alertController.create({
        header: this.translate.instant('login.password'),
        message: this.translate.instant('message.pwdNotSame'),
        buttons: [this.translate.instant('buttons.done')]
      });
      alert.present();
      return;
    }

    let loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.saveaccount')
    });
    await loading.present();

    this.accountService.updatePassword(this.pwd).subscribe(async (resp: any) => {
      await loading.dismiss();
      const alert = await this.alertController.create({
        header: this.translate.instant('login.password'),
        message: this.translate.instant('message.passwordchanged'),
        buttons: [this.translate.instant('buttons.done')]
      });
      alert.present();
      this.router.navigate(['/settings'], { replaceUrl: true });
    },
      (async (error: any) => {
        await loading.dismiss();
        if (error.status === 403) {
          const alert = await this.alertController.create({
            header: this.translate.instant('login.password'),
            message: this.translate.instant('message.pwdWrong'),
            buttons: [this.translate.instant('buttons.done')]
          });
          await alert.present();
        }
      }));
  }
}
