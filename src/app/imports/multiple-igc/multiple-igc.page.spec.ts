import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MultipleIgcPage } from './multiple-igc.page';
import { TranslateModule } from '@ngx-translate/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('MultipleIgcPage', () => {
    let component: MultipleIgcPage;
    let fixture: ComponentFixture<MultipleIgcPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [IonicModule.forRoot(), TranslateModule.forRoot(), MultipleIgcPage],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
        }).compileComponents();

        fixture = TestBed.createComponent(MultipleIgcPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
