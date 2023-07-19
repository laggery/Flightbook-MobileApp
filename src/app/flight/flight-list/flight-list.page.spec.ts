import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FlightListPage } from './flight-list.page';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';

describe('FlightListPage', () => {
  let component: FlightListPage;
  let fixture: ComponentFixture<FlightListPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightListPage ],
      imports: [HttpClientTestingModule, IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [DatePipe]
    }).compileComponents();

    fixture = TestBed.createComponent(FlightListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
