import { Component, effect, OnDestroy, OnInit } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AlertController, LoadingController, NavController, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonItem, IonInput, IonButton, IonCard, IonCardContent, IonText, IonLabel, IonToggle, IonIcon, IonList, IonItemSliding, IonItemOptions, IonItemOption, IonModal, IonDatetime, ModalController, IonReorderGroup, IonReorder, ReorderEndCustomEvent } from '@ionic/angular/standalone';
import HttpStatusCode from '../../shared/util/HttpStatusCode';
import { User } from 'src/app/account/shared/user.model';
import { AccountService } from '../shared/account.service';
import { Subject, takeUntil } from 'rxjs';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import _ from 'lodash';
import { addIcons } from 'ionicons';
import { add, close, trash } from 'ionicons/icons';
import { Link } from '../shared/userConfig.model';
import { LinkComponent } from '../shared/components/link/link.component';

@Component({
    selector: 'app-account-config',
    templateUrl: './account-config.page.html',
    styleUrls: ['./account-config.page.scss'],
    imports: [IonReorder, IonReorderGroup, IonItemOption, IonItemOptions, IonItemSliding, IonList, IonIcon, IonToggle, IonLabel,
        NgIf,
        FormsModule,
        TranslateModule,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonMenuButton,
        IonTitle,
        IonContent,
        IonItem,
        IonButton,
    ]
})
export class AccountConfigPage implements OnInit, OnDestroy {
    unsubscribe$ = new Subject<void>();
    user: User;

    constructor(
        private translate: TranslateService,
        private accountService: AccountService,
        private alertController: AlertController,
        private loadingCtrl: LoadingController,
        private modalController: ModalController,
        public navCtrl: NavController,
    ) {
        effect(() => {
            this.user = _.cloneDeep(this.accountService.currentUser$());
        });

        addIcons({ close, trash, add });
    }

    ngOnInit() { }

    async saveSettings() {
        let loading = await this.loadingCtrl.create({
            message: this.translate.instant('loading.saveaccount')
        });
        await loading.present();

        this.accountService.updateUser(this.user).pipe(takeUntil(this.unsubscribe$)).subscribe({
            next: async (resp: User) => {
                await loading.dismiss();
            },
            error: async (error: any) => {
                await loading.dismiss();
                if (error.status === HttpStatusCode.CONFLICT) {
                    const alert = await this.alertController.create({
                        header: this.translate.instant('message.infotitle'),
                        message: this.translate.instant('message.userExist'),
                        buttons: [this.translate.instant('buttons.done')]
                    });
                    await alert.present();
                }
            }
        })
    }

    deleteLinkItem(index: number) {
        this.user.config?.preparation?.links.splice(index, 1);
    }

    handleReorderEnd(event: ReorderEndCustomEvent) {
        this.user.config.preparation.links = event.detail.complete(this.user.config.preparation.links);
    }

    async linkAddButton() {
        const link = new Link();
        this.manageLinkModal(link, 'add');
    }

    async manageLinkModal(link: Link, type: 'add' | 'edit') {
        const copyLink = { ...link };
        const modal = await this.modalController.create({
            component: LinkComponent,
            componentProps: {
                link: copyLink
            }
        });
        await modal.present();

        const { data } = await modal.onWillDismiss();
        if (data && data.type === 'close') {
            return;
        }

        if (!this.user.config.preparation.links) {
            this.user.config.preparation.links = [];
        }

        if (type === 'add') {
            this.user.config.preparation.links.push(data.link);
        } else if (type === 'edit') {
            Object.assign(link, copyLink);
        }

        await modal.dismiss();
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
