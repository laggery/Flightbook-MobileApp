import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GliderListPage } from './glider-list.page';
import { TranslateModule } from '@ngx-translate/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('GliderListPage', () => {
  let component: GliderListPage;
  let fixture: ComponentFixture<GliderListPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [GliderListPage],
    imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();

    fixture = TestBed.createComponent(GliderListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
