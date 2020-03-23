import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FlightAddPage } from './flight-add.page';

describe('FlightAddPage', () => {
  let component: FlightAddPage;
  let fixture: ComponentFixture<FlightAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightAddPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FlightAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
