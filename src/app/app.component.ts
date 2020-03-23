import { Component } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from './account/account.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService,
    private accountService: AccountService,
    private menuCtrl: MenuController
  ) {
    this.initializeApp();
    this.translate.setDefaultLang('en');
    this.translate.use(localStorage.getItem('language') || navigator.language.split('-')[0]);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  logout() {
    this.menuCtrl.enable(false);
    this.accountService.logout().subscribe(resp => {
      // TODO error handling
    });
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}
