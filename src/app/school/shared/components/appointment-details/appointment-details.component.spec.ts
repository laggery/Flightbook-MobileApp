import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AppointmentDetailsComponent } from './appointment-details.component';
import { TranslateModule } from '@ngx-translate/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AppointmentDetailsComponent', () => {
    let component: AppointmentDetailsComponent;
    let fixture: ComponentFixture<AppointmentDetailsComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [IonicModule.forRoot(), TranslateModule.forRoot(), AppointmentDetailsComponent],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
        }).compileComponents();

        fixture = TestBed.createComponent(AppointmentDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
