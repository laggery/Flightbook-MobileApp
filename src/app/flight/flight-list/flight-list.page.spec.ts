import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FlightListPage } from './flight-list.page';

describe('FlightListPage', () => {
  let component: FlightListPage;
  let fixture: ComponentFixture<FlightListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FlightListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
