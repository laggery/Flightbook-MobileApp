import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { AccountService } from '../account/account.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {
    private excludeUrl: Array<string>;

    constructor(
        private router: Router,
        private accoutService: AccountService,
        private menuCtrl: MenuController
    ) {
        this.excludeUrl = [
            'assets/i18n',
            'auth/login',
            'auth/refresh',
            'news/'
        ];
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return from(this.handle(req, next));
    }

    async handle(req: HttpRequest<any>, next: HttpHandler) {
        let validityCheck = true;
        this.excludeUrl.forEach(url => {
            if (req.url.includes(url)) {
                validityCheck = false;
            }
        });

        if (validityCheck) {
            const authenticated = await this.accoutService.isAuth();
            if (authenticated) {
                return next.handle(this.setHeaders(req)).toPromise();
            } else {
                this.menuCtrl.enable(false);
                this.router.navigate(['login']);
            }
        } else {
            return next.handle(req).toPromise();
        }
    }

    private setHeaders(request: HttpRequest<any>): HttpRequest<any> {
        return request.clone({
            setHeaders: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
        });
    }
}
