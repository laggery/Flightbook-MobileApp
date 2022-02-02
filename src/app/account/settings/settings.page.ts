import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, LoadingController } from '@ionic/angular';
import HttpStatusCode from '../../shared/util/HttpStatusCode';
import { AccountService } from 'src/app/core/services/account.service';
import { User } from 'src/app/core/domain/user';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  user: User;

  constructor(
    private translate: TranslateService,
    private accountService: AccountService,
    private alertController: AlertController,
    private loadingCtrl: LoadingController
  ) {
    this.accountService.currentUser().subscribe((resp: User) => {
      this.user = resp;
    })
  }

  ngOnInit() {
  }
  
  async saveSettings() {
    let loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.saveaccount')
    });
    await loading.present();

    this.accountService.updateUser(this.user).subscribe(async(resp: User) => {
      await loading.dismiss();
    },
    (async (error: any) => {
      await loading.dismiss();
      if (error.status === HttpStatusCode.CONFLICT) {
        const alert = await this.alertController.create({
          header: this.translate.instant('message.infotitle'),
          message: this.translate.instant('message.userExist'),
          buttons: [this.translate.instant('buttons.done')]
        });
        await alert.present();
      }
    }));
  }

  setLanguage(lang: string) {
    localStorage.setItem('language', lang);
    this.translate.use(lang)
  }
}
