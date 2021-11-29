import { NgModule } from '@angular/core';
import { MenuItemComponent } from './layout/menu-item/menu-item.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FileInputComponent } from './file-input/file-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapComponent } from './map/map.component';
import { CommonModule } from '@angular/common';
import { GliderSelectComponent } from './glider-select/glider-select.component';

@NgModule({
  declarations: [
    MenuItemComponent,
    FileInputComponent,
    MapComponent,
    GliderSelectComponent
  ],
  exports: [
    MenuItemComponent,
    FileInputComponent,
    MapComponent,
    GliderSelectComponent
  ],
  imports: [
    IonicModule,
    TranslateModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class SharedModule {

}


