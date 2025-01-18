import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlaceEditPage } from './place-edit.page';
import { TranslateModule } from '@ngx-translate/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, Router, RouterModule, convertToParamMap } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PlaceEditPage', () => {
  let component: PlaceEditPage;
  let fixture: ComponentFixture<PlaceEditPage>;
  let mockActivatedRoute: any;

  beforeEach(waitForAsync(() => {
    mockActivatedRoute = {
      snapshot: {
        paramMap: convertToParamMap({
          id: '123'
        })
      }
    };

    TestBed.configureTestingModule({
    imports: [RouterModule.forRoot([]), IonicModule.forRoot(), TranslateModule.forRoot(), PlaceEditPage],
    providers: [
        { provide: Router, useClass: class {
                navigate = jasmine.createSpy("navigate");
            } },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
}).compileComponents();

    fixture = TestBed.createComponent(PlaceEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
