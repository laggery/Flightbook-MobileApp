import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MenuController, AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(
        private router: Router,
        private menuCtrl: MenuController,
        private alertController: AlertController,
        private translate: TranslateService
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                this.menuCtrl.enable(false);
                this.router.navigate(['login']);
            }

            if (err.status >= 500 || err.status === 0) {
                this.alertController.create({
                    header: this.translate.instant('message.infotitle'),
                    message: this.translate.instant('message.error'),
                    buttons: [this.translate.instant('buttons.done')]
                  }).then((alert: any) => {
                      alert.present();
                  });
            }
            return throwError(err);
        }));
    }
}
