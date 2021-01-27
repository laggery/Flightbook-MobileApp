import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FlightStatistic } from 'flightbook-commons-library';

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'bar-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnInit {

  @Input() chartType: "nbFlights" | "income";

  width: number;
  height: number;
  margin = { top: 20, right: 20, bottom: 30, left: 40 };
  x: any;
  y: any;
  svg: any;
  g: any;
  div: any;

  constructor(private translate: TranslateService) {
    this.width = 900 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
  }

  private initSvg() {
    this.div = d3.select('.barChart').append('div');
    this.svg = this.div
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', '0 0 900 500');
    this.g = this.svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  private initAxis(statisticsList: FlightStatistic[]) {
    this.x = d3Scale.scaleBand().rangeRound([0, this.width]).padding(0.1);
    this.y = d3Scale.scaleLinear().rangeRound([this.height, 0]);
    this.x.domain(statisticsList.map((d) => d.year));
    this.y.domain([0, d3Array.max(statisticsList, (d: any) => d[this.chartType])]);
  }

  private drawAxis(yAxisTranslation: string) {
    // x axis -> Years
    this.g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3Axis.axisBottom(this.x));

    // y left axis -> nb flights
    this.g.append('g')
      .attr('class', 'axis axis--yLeft')
      .call(d3Axis.axisLeft(this.y))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("dy", ".75em")
      .attr("y", 6)
      .style("text-anchor", "end")
      .attr('fill', 'black')
      .text(yAxisTranslation);
  }

  private drawBars(statisticsList: FlightStatistic[]) {
    let rectG = this.g.selectAll('.bar')
      .data(statisticsList)
      .enter().append('g')

    rectG.append("rect")
      .attr('class', 'bar-nbFlight')
      .attr('x', (d: any) => this.x(d.year))
      .attr('y', (d: any) => this.y(d[this.chartType]))
      .attr('width', this.x.bandwidth())
      .attr('height', (d: any) => this.height - this.y(d[this.chartType]))
      .attr('fill', '#3880ff');

    rectG
      .append('text')
      .attr('x', (d: any) => {
        if (d[this.chartType]) {
          return this.x(d.year) + (this.x.bandwidth() - ((this.x.bandwidth()  / 2) + d[this.chartType].toString().length * 4.6));
        }
        return null;
      })
      .attr('y', (d: any) => this.y(d[this.chartType]) + 17)
      .attr('fill', 'white')
      .text((d: any) => {
        return d[this.chartType];
      });
  }

  public displayBarChart(statisticsList: FlightStatistic[]) {
    this.div?.remove();
    if (d3Array.max(statisticsList, (d: any) => d[this.chartType]) > 0) {
      this.initSvg();
      this.initAxis(statisticsList);
      const yAxisTranslation = (this.chartType === 'nbFlights') ? this.translate.instant('statistics.nbflight') : this.translate.instant('statistics.price');
      this.drawAxis(yAxisTranslation);
      this.drawBars(statisticsList);
    }
  }

  ngOnInit() { }

}
