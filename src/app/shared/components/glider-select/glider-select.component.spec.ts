import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GliderSelectComponent } from './glider-select.component';
import { TranslateModule } from '@ngx-translate/core';

describe('GliderSelectComponent', () => {
  let component: GliderSelectComponent;
  let fixture: ComponentFixture<GliderSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), TranslateModule.forRoot(), GliderSelectComponent]
}).compileComponents();

    fixture = TestBed.createComponent(GliderSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
