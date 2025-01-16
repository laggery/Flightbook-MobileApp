import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FlightEditPage } from './flight-edit.page';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from "@angular/router/testing";
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('FlightEditPage', () => {
  let component: FlightEditPage;
  let fixture: ComponentFixture<FlightEditPage>;

  class RouterStub{
    navigate = jasmine.createSpy("navigate");
    getCurrentNavigation(){
      return {
         extras: {
            state:{
            }
          }
        }
      }
   }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [FlightEditPage],
    imports: [IonicModule.forRoot(),
        TranslateModule.forRoot(),
        RouterTestingModule],
    providers: [
        { provide: Router, useClass: RouterStub },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
}).compileComponents();

    fixture = TestBed.createComponent(FlightEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
