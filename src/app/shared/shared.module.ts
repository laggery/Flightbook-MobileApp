import { NgModule } from '@angular/core';
import { MenuItemComponent } from './components/menu-item/menu-item.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FileInputComponent } from './components/file-input/file-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IgcMapComponent } from './components/igc-map/igc-map.component';
import { CommonModule, DatePipe } from '@angular/common';
import { HoursFormatPipe } from './pipes/hours-format/hours-format.pipe';
import { GliderSelectComponent } from './components/glider-select/glider-select.component';
import { PlaceMapComponent } from './components/place-map/place-map.component';

@NgModule({
  declarations: [
    MenuItemComponent,
    FileInputComponent,
    IgcMapComponent,
    PlaceMapComponent,
    GliderSelectComponent,
    HoursFormatPipe
  ],
  exports: [
    MenuItemComponent,
    FileInputComponent,
    IgcMapComponent,
    PlaceMapComponent,
    GliderSelectComponent,
    HoursFormatPipe
  ],
  imports: [
    IonicModule,
    TranslateModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [
    DatePipe
  ]
})
export class SharedModule {

}


