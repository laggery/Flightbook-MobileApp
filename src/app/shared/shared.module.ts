import { NgModule } from '@angular/core';
import { MenuItemComponent } from './layout/menu-item/menu-item.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FileInputComponent } from './file-input/file-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapComponent } from './map/map.component';
import { CommonModule, DatePipe } from '@angular/common';
import { GliderSelectComponent } from './glider-select/glider-select.component';
import { HoursFormatPipe } from './pipes/hours-format/hours-format.pipe';

@NgModule({
  declarations: [
    MenuItemComponent,
    FileInputComponent,
    MapComponent,
    GliderSelectComponent,
    HoursFormatPipe
  ],
  exports: [
    MenuItemComponent,
    FileInputComponent,
    MapComponent,
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


