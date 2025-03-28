import { NgModule } from '@angular/core';
import { MenuItemComponent } from './components/menu-item/menu-item.component';
import { TranslateModule } from '@ngx-translate/core';
import { FileInputComponent } from './components/file-input/file-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IgcMapComponent } from './components/igc-map/igc-map.component';
import { CommonModule, DatePipe } from '@angular/common';
import { HoursFormatPipe } from './pipes/hours-format.pipe';
import { GliderSelectComponent } from './components/glider-select/glider-select.component';
import { PlaceMapComponent } from './components/place-map/place-map.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { NxgTransalteSortPipe } from './pipes/nxg-transalte-sort.pipe';
import { PhoneNumberComponent } from './components/phone-number/phone-number.component';

@NgModule({
    exports: [
        MenuItemComponent,
        FileInputComponent,
        IgcMapComponent,
        PlaceMapComponent,
        GliderSelectComponent,
        HoursFormatPipe,
        StarRatingComponent,
        NxgTransalteSortPipe,
        PhoneNumberComponent
    ],
    imports: [
        TranslateModule,
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        MenuItemComponent,
        FileInputComponent,
        IgcMapComponent,
        PlaceMapComponent,
        GliderSelectComponent,
        HoursFormatPipe,
        StarRatingComponent,
        NxgTransalteSortPipe,
        PhoneNumberComponent
    ],
    providers: [
        DatePipe
    ]
})
export class SharedModule {

}


