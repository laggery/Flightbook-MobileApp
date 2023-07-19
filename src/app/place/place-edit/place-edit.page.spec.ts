import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlaceEditPage } from './place-edit.page';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router, RouterModule, convertToParamMap } from '@angular/router';

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
      declarations: [ PlaceEditPage ],
      imports: [HttpClientTestingModule, RouterModule.forRoot([]), IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: Router, useClass: class { navigate = jasmine.createSpy("navigate"); }},
        { provide: ActivatedRoute, useValue: mockActivatedRoute }]
    }).compileComponents();

    fixture = TestBed.createComponent(PlaceEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
