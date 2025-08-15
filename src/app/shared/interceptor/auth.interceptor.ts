import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, firstValueFrom, from } from 'rxjs';
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
            ['v2/users', 'POST'],
            ['users/verify-email', 'GET'],
            ['auth/refresh', 'GET'],
            ['auth/refresh', 'POST'],
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
                if (req.url.includes('file/upload') || req.url.includes('import')) {
                    return next.handle(this.setFormDataHeaders(req)).toPromise();
                }
                return next.handle(this.setHeaders(req)).toPromise();
            } else {
                this.router.navigate(['login'], { replaceUrl: true });
            }
        } else {
            return next.handle(this.setNotAuthenticatedHeaders(req)).toPromise();
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
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                'Accept-Language': localStorage.getItem('language') || navigator.language.split('-')[0]
            }
        });
    }
    private setNotAuthenticatedHeaders(request: HttpRequest<any>): HttpRequest<any> {
        return request.clone({
            setHeaders: {
                'Accept-Language': localStorage.getItem('language') || navigator.language.split('-')[0]
            }
        });
    }
}
