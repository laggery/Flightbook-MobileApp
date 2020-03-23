import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GliderEditPage } from './glider-edit.page';

describe('GliderEditPage', () => {
  let component: GliderEditPage;
  let fixture: ComponentFixture<GliderEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GliderEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GliderEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
