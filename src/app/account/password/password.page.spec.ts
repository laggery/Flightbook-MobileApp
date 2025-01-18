import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PasswordPage } from './password.page';
import { TranslateModule } from '@ngx-translate/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PasswordPage', () => {
    let component: PasswordPage;
    let fixture: ComponentFixture<PasswordPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [IonicModule.forRoot(), TranslateModule.forRoot(), PasswordPage],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
        }).compileComponents();

        fixture = TestBed.createComponent(PasswordPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
