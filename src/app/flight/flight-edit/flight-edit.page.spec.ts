import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FlightEditPage } from './flight-edit.page';

describe('FlightEditPage', () => {
  let component: FlightEditPage;
  let fixture: ComponentFixture<FlightEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FlightEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
