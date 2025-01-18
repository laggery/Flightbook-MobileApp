import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardItemComponent } from './dashboard-item.component';
import { TranslateModule } from '@ngx-translate/core';

describe('DashboardItemComponent', () => {
    let component: DashboardItemComponent;
    let fixture: ComponentFixture<DashboardItemComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [IonicModule.forRoot(), TranslateModule.forRoot(), DashboardItemComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
