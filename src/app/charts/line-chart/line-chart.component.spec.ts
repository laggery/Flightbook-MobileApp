import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LineChartComponent } from './line-chart.component';
import { TranslateModule } from '@ngx-translate/core';

describe('LineChartComponent', () => {
    let component: LineChartComponent;
    let fixture: ComponentFixture<LineChartComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [IonicModule.forRoot(), TranslateModule.forRoot(), LineChartComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(LineChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
