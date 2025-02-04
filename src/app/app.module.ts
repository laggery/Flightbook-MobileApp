import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { IonicRouteStrategy, provideIonicAngular, IonApp, IonSplitPane, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonMenuToggle, IonItem, IonRouterOutlet } from '@ionic/angular/standalone';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SharedModule } from './shared/shared.module';

import { HttpAuthInterceptor } from './shared/interceptor/auth.interceptor';
import { HttpErrorInterceptor } from './shared/interceptor/error.interceptor';
import { PaymentService } from './shared/services/payment.service';
import { registerLocaleData } from '@angular/common';
import germanLocale from '@angular/common/locales/de';
import italianLocale from '@angular/common/locales/it';
import frenchLocale from '@angular/common/locales/fr';
import { NavigationService } from './shared/services/navigation.service';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function tokenGetter() {
    return localStorage.getItem('access_token');
}

registerLocaleData(germanLocale);
registerLocaleData(italianLocale);
registerLocaleData(frenchLocale);

@NgModule({
    declarations: [AppComponent],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
        SharedModule,
        AppRoutingModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
        IonApp,
        IonSplitPane,
        IonMenu,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonList,
        IonMenuToggle,
        IonItem,
        IonRouterOutlet
    ], providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: HttpAuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
        PaymentService,
        NavigationService,
        provideHttpClient(withInterceptorsFromDi()),
        provideIonicAngular()
    ]
})
export class AppModule {
    constructor(private navigationService: NavigationService) { }
}
