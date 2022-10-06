import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AccountService } from 'src/app/account/shared/account.service';

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {
    private excludeUrl: Array<Array<string>>;

    constructor(
        private router: Router,
        private accoutService: AccountService
    ) {
        this.excludeUrl = [
            ['assets/i18n', 'GET'],
            ['flightbook-bucket', 'PUT'],
            ['auth/login', 'POST'],
            ['users', 'POST'],
            ['auth/refresh', 'GET'],
            ['auth/reset-password', 'GET'],
            ['news', 'GET']
        ];
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return from(this.handle(req, next));
    }

    async handle(req: HttpRequest<any>, next: HttpHandler) {
        let validityCheck = true;
        this.excludeUrl.forEach(url => {
            if (req.url.includes(url[0]) && req.method === url[1]) {
                validityCheck = false;
            }
        });

        if (validityCheck) {
            const authenticated = await this.accoutService.isAuth();
            if (authenticated) {
                if (req.url.includes('file/upload')){
                  return next.handle(this.setFormDataHeaders(req)).toPromise();
                }
                return next.handle(this.setHeaders(req)).toPromise();
            } else {
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
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                'Accept-Language': localStorage.getItem('language') || navigator.language.split('-')[0]
            }
        });
    }
  private setFormDataHeaders(request: HttpRequest<any>): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });
  }
}
