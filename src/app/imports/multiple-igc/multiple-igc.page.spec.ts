import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MultipleIgcPage } from './multiple-igc.page';

describe('MultipleIgcPage', () => {
  let component: MultipleIgcPage;
  let fixture: ComponentFixture<MultipleIgcPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleIgcPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MultipleIgcPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
