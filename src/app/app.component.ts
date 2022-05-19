import { Component, OnDestroy, OnInit } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SwUpdate } from '@angular/service-worker';
import { AccountService } from './account/shared/account.service';
import { FlightService } from './flight/shared/flight.service';
import { GliderService } from './glider/shared/glider.service';
import { PlaceService } from './place/shared/place.service';
import { User } from './account/shared/user.model';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {
  unsubscribe$ = new Subject<void>();
  user: User;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private translate: TranslateService,
    private accountService: AccountService,
    private menuCtrl: MenuController,
    private swUpdate: SwUpdate,
    private flighService: FlightService,
    private gliderService: GliderService,
    private placeService: PlaceService
  ) {
    this.initializeApp();
    this.translate.setDefaultLang('en');
    this.translate.use(localStorage.getItem('language') || navigator.language.split('-')[0]);

    // this.accountService.currentUser().subscribe((resp: User) => {
    //   this.user = resp;
    // })
  }

  ngOnInit(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        this.swUpdate.activateUpdate().then(() => document.location.reload());
      });
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
    });
  }

  logout() {
    this.menuCtrl.enable(false);
    this.flighService.setState([]);
    this.gliderService.setState([]);
    this.placeService.setState([]);
    this.accountService.logout().pipe(takeUntil(this.unsubscribe$)).subscribe(resp => {
      // TODO error handling
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
