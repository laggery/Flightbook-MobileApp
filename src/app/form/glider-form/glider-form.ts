import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AlertController, IonItem, IonInput, IonLabel, IonToggle, IonTextarea, IonButton, IonModal, IonContent, IonDatetime, IonList, IonItemSliding, IonItemOptions, IonItemOption, IonIcon, IonToolbar, IonButtons, IonTitle, IonHeader, IonMenuButton, ModalController, IonApp } from '@ionic/angular/standalone';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Glider, GliderCheck } from 'src/app/glider/shared/glider.model';
import { FormsModule } from '@angular/forms';
import { NgIf, DatePipe } from '@angular/common';
import { addIcons } from 'ionicons';
import { add, close, trash } from 'ionicons/icons';
import { CheckComponent } from './check/check.component';

@Component({
    selector: 'glider-form',
    templateUrl: 'glider-form.html',
    styleUrls: ['glider-form.scss'],
    imports: [FormsModule, NgIf, DatePipe, TranslateModule, IonItem, IonInput, IonLabel, IonToggle, IonTextarea, IonButton, IonModal, IonContent, IonDatetime, IonList, IonItemSliding, IonItemOptions, IonItemOption, IonIcon]
})
export class GliderFormComponent implements OnInit {
    @Input()
    glider: Glider;
    @Output()
    saveGlider = new EventEmitter<Glider>();
    language: string;
    displayArchived = false;

    constructor(
        private alertController: AlertController,
        private translate: TranslateService,
        private modalController: ModalController
    ) {
        this.language = this.translate.currentLang;
        addIcons({ close, trash, add });
    }

    ngOnInit() {
        if (this.glider.name) {
            this.displayArchived = true;
        }
    }

    async saveElement(loginForm: any) {
        if (loginForm.valid) {
            this.saveGlider.emit(this.glider);
        } else {
            const alert = await this.alertController.create({
                header: this.translate.instant('message.errortitle'),
                message: this.translate.instant('message.mendatoryFields'),
                buttons: [this.translate.instant('buttons.done')]
            });
            await alert.present();
        }
    }

    changeBuyDate(event: CustomEvent) {
        this.glider.buyDate = event.detail.value ? event.detail.value : new Date();
    }

    cancelButton() {
        this.glider.buyDate = null;
    }

    deleteCheckItem(check: GliderCheck) {
        const index = this.glider.checks.indexOf(check);
        if (index > -1) {
            this.glider.checks.splice(index, 1);
        }
    }

    async gliderCheckAddButton() {
        const gliderCheck = new GliderCheck();
        gliderCheck.date = new Date();
        this.manageCheckModal(gliderCheck, 'add');
    }

    async manageCheckModal(gliderCheck: GliderCheck, type: 'add' | 'edit') {
        const copyGliderCheck = { ...gliderCheck };
        const modal = await this.modalController.create({
            component: CheckComponent,
            componentProps: {
                gliderCheck: copyGliderCheck
            }
        });
        await modal.present();

        const { data } = await modal.onWillDismiss();
        if (data && data.type === 'close') {
            return;
        }

        if (!this.glider.checks) {
            this.glider.checks = [];
        }

        if (type === 'add') {
            this.glider.checks.push(data.gliderCheck);
        } else if (type === 'edit') {
            Object.assign(gliderCheck, copyGliderCheck);
        }

        this.glider.checks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        await modal.dismiss();
    }
}
