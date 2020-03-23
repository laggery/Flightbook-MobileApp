import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlaceListPage } from './place-list.page';

describe('PlaceListPage', () => {
  let component: PlaceListPage;
  let fixture: ComponentFixture<PlaceListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaceListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlaceListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
