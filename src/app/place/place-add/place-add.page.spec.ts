import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlaceAddPage } from './place-add.page';

describe('PlaceAddPage', () => {
  let component: PlaceAddPage;
  let fixture: ComponentFixture<PlaceAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaceAddPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlaceAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
