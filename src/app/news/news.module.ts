import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewsPageRoutingModule } from './news-routing.module';

import { NewsPage } from './news.page';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardContainerModule } from '../dashboard/dashboard-container/dashboard-container.module';
import { DashboardItemModule } from '../dashboard/dashboard-item/dashboard-item.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewsPageRoutingModule,
    TranslateModule.forChild(),
    DashboardContainerModule,
    DashboardItemModule
  ],
  providers: [],
  declarations: [NewsPage]
})
export class NewsPageModule {}
