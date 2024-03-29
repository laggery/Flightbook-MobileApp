import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { GliderEditPage } from './glider-edit.page';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';

describe('GliderEditPage', () => {
  let component: GliderEditPage;
  let fixture: ComponentFixture<GliderEditPage>;
  let mockActivatedRoute: any;
  let routerMock: any;

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
    mockActivatedRoute = {
      snapshot: {
        paramMap: convertToParamMap({
          id: '123'
        })
      }
    };

    TestBed.configureTestingModule({
      declarations: [GliderEditPage],
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        NavController,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GliderEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
