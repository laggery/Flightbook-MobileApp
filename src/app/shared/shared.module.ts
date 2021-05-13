import { NgModule } from '@angular/core';
import { MenuItemComponent } from './layout/menu-item/menu-item.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FileInputComponent } from './file-input/file-input.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MenuItemComponent,
    FileInputComponent
  ],
  exports: [
    MenuItemComponent,
    FileInputComponent
  ],
  imports: [
    IonicModule,
    TranslateModule,
    FormsModule
  ]
})
export class SharedModule {

}


