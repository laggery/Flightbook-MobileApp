import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import DataLabelsPlugin, { Context } from 'chartjs-plugin-datalabels';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() chartType: 'nbFlights' | 'income';
  @Input() data: ChartData<'bar'>;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  barChartLegend = true;
  barChartPlugins: any = [DataLabelsPlugin];

  public barChartOptions: ChartConfiguration['options'] = {
    backgroundColor: 'rgb(0, 84, 233)',
    responsive: true,
    maintainAspectRatio: false,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: { min: 0 , max: 15 },
      y: {},
    },
    plugins: {
      tooltip: {
        callbacks: {
          labelColor: (context) => {
            return {
              borderColor: 'rgb(0, 84, 233)',
              backgroundColor: 'rgb(0, 84, 233)',
            };
          },
        }
      },
      legend: {
        display: true,
        align: 'start'
      },
      datalabels: {
        rotation: -45,
        labels: {
          title: {
            font: {
              weight: 'bold',
              
            }
          }
        },
        anchor: 'end',
        offset: -6,
        align: 'end',
        display: (context: Context) => {
          return context.dataIndex <= context.chart.scales.x.min - 1 ? false : true; 
        }
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x'
        }
      }
    }
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
      this.barChartOptions.scales.x.min = this.data.datasets[0].data.length - 15;
      this.barChartOptions.scales.x.max = this.data.datasets[0].data.length;
    }
  }

}
