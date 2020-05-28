import { NgModule } from '@angular/core';
import { GliderFormComponent } from './glider-form/glider-form';
import { IonicModule } from '@ionic/angular';
import { PlaceFormComponent } from './place-form/place-form';
import { FlightFormComponent } from './flight-form/flight-form';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
@NgModule({
    declarations: [
        PlaceFormComponent,
        GliderFormComponent,
        FlightFormComponent,
        AutocompleteComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule.forChild()
    ],
    exports: [
        PlaceFormComponent,
        GliderFormComponent,
        FlightFormComponent,
        AutocompleteComponent
    ]
})
export class FormModule { }
