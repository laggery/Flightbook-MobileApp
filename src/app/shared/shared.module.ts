import { NgModule } from '@angular/core';
import { MenuItemComponent } from './layout/menu-item/menu-item.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FileInputComponent } from './file-input/file-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapComponent } from './map/map.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    MenuItemComponent,
    FileInputComponent,
    MapComponent,
  ],
  exports: [
    MenuItemComponent,
    FileInputComponent,
    MapComponent
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


