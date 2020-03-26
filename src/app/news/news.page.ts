import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { NewsService } from './news.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {
  newsData: any;

  constructor(
    private menuCtrl: MenuController,
    private translate: TranslateService,
    private newsService: NewsService
  ) {
    this.menuCtrl.enable(true);
    this.newsService.getNews(this.translate.currentLang).subscribe(resp => {
      this.newsData = resp.body;
    });
  }

  ngOnInit() {
  }

}
