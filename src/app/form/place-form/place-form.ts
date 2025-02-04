import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AlertController, IonItem, IonInput, IonSelect, IonSelectOption, IonTextarea, IonButton } from '@ionic/angular/standalone';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Place } from 'src/app/place/shared/place.model';
import { Countries, Country } from 'src/app/place/shared/place.countries';
import { FormsModule } from '@angular/forms';
import { PlaceMapComponent } from '../../shared/components/place-map/place-map.component';

@Component({
    selector: 'place-form',
    templateUrl: 'place-form.html',
    imports: [FormsModule, PlaceMapComponent, TranslateModule, IonItem, IonInput, IonSelect, IonSelectOption, IonTextarea, IonButton]
})
export class PlaceFormComponent {

    @Input()
    place: Place;
    @Output()
    savePlace = new EventEmitter<Place>();

    countries: Country[] = Countries;
    lang: string;

    constructor(
        private alertController: AlertController,
        private translate: TranslateService
    ) {
        this.lang = this.translate.currentLang;
        this.countries.sort((a, b) => a.name[this.lang].localeCompare(b.name[this.lang]));
        this.moveCountryToTop('de');
        this.moveCountryToTop('fr');
        this.moveCountryToTop('at');
        this.moveCountryToTop('ch');
    }

    async saveElement(loginForm: any) {
        if (loginForm.valid) {
            this.savePlace.emit(this.place);
        } else {
            const alert = await this.alertController.create({
                header: this.translate.instant('message.errortitle'),
                message: this.translate.instant('message.mendatoryFields'),
                buttons: [this.translate.instant('buttons.done')]
            });
            await alert.present();
        }
    }

    clearCountry() {
        this.place.country = null;
    }

    moveCountryToTop(countryCode: string) {
        let index = this.countries.findIndex(country => country.code == countryCode);
        if (index !== -1) {
            let country = this.countries.splice(index, 1)[0];
            this.countries.splice(0, 0, country);
        }
    }

}
