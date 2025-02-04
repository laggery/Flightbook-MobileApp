import { Component, OnInit } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AlertController, IonInputPasswordToggle, LoadingController, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonItem, IonInput, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import HttpStatusCode from '../../shared/util/HttpStatusCode';
import { AccountService } from '../shared/account.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-password',
    templateUrl: './password.page.html',
    styleUrls: ['./password.page.scss'],
    imports: [
        FormsModule,
        TranslateModule,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonMenuButton,
        IonTitle,
        IonContent,
        IonItem,
        IonInput,
        IonInputPasswordToggle,
        IonButton
    ]
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
                if (error.status === HttpStatusCode.FORBIDDEN) {
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
