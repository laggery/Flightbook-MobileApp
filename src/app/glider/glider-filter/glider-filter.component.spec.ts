import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GliderFilterComponent } from './glider-filter.component';

describe('GliderFilterComponent', () => {
  let component: GliderFilterComponent;
  let fixture: ComponentFixture<GliderFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GliderFilterComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GliderFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
