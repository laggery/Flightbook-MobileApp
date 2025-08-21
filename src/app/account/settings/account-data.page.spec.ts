import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AccountDataPage } from './account-data.page';
import { TranslateModule } from '@ngx-translate/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('SettingsPage', () => {
    let component: AccountDataPage;
    let fixture: ComponentFixture<AccountDataPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [IonicModule.forRoot(), TranslateModule.forRoot(), AccountDataPage],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
        }).compileComponents();

        fixture = TestBed.createComponent(AccountDataPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
