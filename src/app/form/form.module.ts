import { NgModule } from '@angular/core';
import { GliderFormComponent } from './glider-form/glider-form';
import { PlaceFormComponent } from './place-form/place-form';
import { FlightFormComponent } from './flight-form/flight-form';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { FlightFilterComponent } from './flight-filter/flight-filter.component';
import { SharedModule } from '../shared/shared.module';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule.forChild(),
        SharedModule,
        PlaceFormComponent,
        GliderFormComponent,
        FlightFormComponent,
        FlightFilterComponent,
        AutocompleteComponent
    ],
    exports: [
        PlaceFormComponent,
        GliderFormComponent,
        FlightFormComponent,
        FlightFilterComponent,
        AutocompleteComponent
    ]
})
export class FormModule { }
