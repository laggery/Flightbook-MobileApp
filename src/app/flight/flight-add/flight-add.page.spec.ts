import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FlightAddPage } from './flight-add.page';
import { TranslateModule } from '@ngx-translate/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('FlightAddPage', () => {
  let component: FlightAddPage;
  let fixture: ComponentFixture<FlightAddPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [FlightAddPage],
    imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();

    fixture = TestBed.createComponent(FlightAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
