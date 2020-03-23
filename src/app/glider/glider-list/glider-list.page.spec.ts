import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GliderListPage } from './glider-list.page';

describe('GliderListPage', () => {
  let component: GliderListPage;
  let fixture: ComponentFixture<GliderListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GliderListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GliderListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
