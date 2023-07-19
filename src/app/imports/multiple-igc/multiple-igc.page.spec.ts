import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MultipleIgcPage } from './multiple-igc.page';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MultipleIgcPage', () => {
  let component: MultipleIgcPage;
  let fixture: ComponentFixture<MultipleIgcPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleIgcPage ],
      imports: [HttpClientTestingModule, IonicModule.forRoot(), TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MultipleIgcPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
