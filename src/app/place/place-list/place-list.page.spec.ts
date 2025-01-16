import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlaceListPage } from './place-list.page';
import { TranslateModule } from '@ngx-translate/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PlaceListPage', () => {
  let component: PlaceListPage;
  let fixture: ComponentFixture<PlaceListPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [PlaceListPage],
    imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();

    fixture = TestBed.createComponent(PlaceListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
