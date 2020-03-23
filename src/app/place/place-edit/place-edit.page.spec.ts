import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlaceEditPage } from './place-edit.page';

describe('PlaceEditPage', () => {
  let component: PlaceEditPage;
  let fixture: ComponentFixture<PlaceEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaceEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlaceEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
