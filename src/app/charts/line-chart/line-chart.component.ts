import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { HoursFormatPipe } from 'src/app/shared/pipes/hours-format/hours-format.pipe';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartConfiguration, ChartData } from 'chart.js';
import 'chartjs-adapter-moment';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() data: ChartData<'line'>;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  lineChartLegend = true;
  lineChartPlugins: any = [DataLabelsPlugin];

  public lineChartOptions: ChartConfiguration['options'] = {
    backgroundColor(context,  options) {
      return (context.dataset.yAxisID === 'y1') ? 'rgb(143,187,255)' : 'rgb(66,140,255)'; 
    },
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      point: {
        radius: 5,
      },
      line: {
        tension: 0.2
      },
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      x: { min: 0 , max: 15 },
      y: {
        position: 'left',
        ticks: {
          callback: label => (label === 0) ? '00:00' : new HoursFormatPipe().transform(label).slice(0, -3)
        }
      },
      y1: {
        position: 'right',
        grid: {
          display: false
        },
        ticks: {
          color: 'rgb(143,187,255)',
          callback: label => (label === 0) ? '00:00' : new HoursFormatPipe().transform(label).slice(0, -3)
        },
      },
    },

    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => (tooltipItem.raw === 0) ? '00:00:00' : new HoursFormatPipe().transform(tooltipItem.raw),
          labelColor: (context) => {
            return {
              borderColor: (context.dataset.yAxisID === 'y1') ? 'rgb(143,187,255)' : 'rgb(66,140,255)',
              backgroundColor: (context.dataset.yAxisID === 'y1') ? 'rgb(143,187,255)' : 'rgb(66,140,255)'
            };
          }
        }
      },
      legend: { 
        display: true,
        align: 'start'
      },
      datalabels: {
        display: false
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x'
        }
      }
    },
  };

  constructor() {
    if (!this.data) {
      this.data = {
        labels: [],
        datasets: [
          { data: [] }
        ]
      };
    }
  }

  ngOnInit() { }

  ngAfterViewInit() { 
    this.chart.chart.canvas.style.touchAction = "pan-y";
  }

  ngOnChanges(event: SimpleChanges) {
    if (event.data) {
        this.lineChartOptions.scales.x.min = this.data.datasets[0].data.length - 15;
        this.lineChartOptions.scales.x.max = this.data.datasets[0].data.length;
    }
  }

}
