import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FlightStatisticPage } from './flight-statistic.page';
import { TranslateModule } from '@ngx-translate/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HoursFormatPipe } from 'src/app/shared/pipes/hours-format.pipe';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('FlightStatisticPage', () => {
  let component: FlightStatisticPage;
  let fixture: ComponentFixture<FlightStatisticPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [FlightStatisticPage, HoursFormatPipe],
    imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();

    fixture = TestBed.createComponent(FlightStatisticPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
