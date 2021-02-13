import { NgModule } from '@angular/core';
import { MenuItemComponent } from './layout/menu-item/menu-item.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MenuItemComponent
  ],
  exports: [
    MenuItemComponent
  ],
  imports: [
    IonicModule,
    TranslateModule
  ]
})
export class SharedModule {

}


