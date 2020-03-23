import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FlightStatisticPage } from './flight-statistic.page';

describe('FlightStatisticPage', () => {
  let component: FlightStatisticPage;
  let fixture: ComponentFixture<FlightStatisticPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightStatisticPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FlightStatisticPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
