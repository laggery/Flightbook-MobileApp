import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FlightListPage } from './flight-list.page';
import { TranslateModule } from '@ngx-translate/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('FlightListPage', () => {
  let component: FlightListPage;
  let fixture: ComponentFixture<FlightListPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [FlightListPage],
    imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
    providers: [DatePipe, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();

    fixture = TestBed.createComponent(FlightListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
