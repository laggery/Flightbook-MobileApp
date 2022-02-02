import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

import * as d3 from 'd3';
import * as d3Selection from 'd3-selection';
import { TranslateService } from '@ngx-translate/core';
import { FlightStatistic } from 'src/app/core/domain/flightStatistic';
import { HoursFormatPipe } from 'src/app/shared/pipes/hours-format/hours-format.pipe';

@Component({
  selector: 'line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnInit {
  private width = 700;
  private height = 700;
  private margin = { top: 20, right: 20, bottom: 30, left: 40 };
  private svg: any;
  private svgInner: any;
  private yScale: any;
  private xScale: any;
  private xAxis: any;
  private yAxis: any;
  private lineGroup: any;
  private color = 'rgb(56, 128, 255)';

  constructor(private translate: TranslateService) {
    this.width = 900 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
  }

  private initializeChart(statisticsList: any[]): void {
    this.svg = d3
      .select('.lineChart')
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', '0 0 900 500');
    this.svgInner = this.svg
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    this.yScale = d3
      .scaleLinear()
      .domain([d3.max(statisticsList, d => d.hourTime), d3.min(statisticsList, d => d.hourTime)])
      .rangeRound([0, this.height]);

    this.yAxis = this.svgInner
      .append('g')
      .style('font-size', '20px')
      .style('font-weight', '700')
      .attr('class', 'axis axis--yLeft');

    this.xScale = d3.scaleTime().rangeRound([0, this.width]).domain(d3.extent(statisticsList, d => new Date(d.date)));

    this.xAxis = this.svgInner
      .append('g')
      .style('font-size', '20px')
      .style('font-weight', '700')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + this.height + ')');

    this.lineGroup = this.svgInner
      .append('g')
      .append('path')
      .attr('id', 'line')
      .style('fill', 'none')
      .style('stroke', this.color)
      .style('stroke-width', '2px');
  }

  private drawChart(statisticsList: any[]): void {

    const xAxis = d3
      .axisBottom(this.xScale)
      .ticks(10)
      .tickFormat(d3.timeFormat('%Y'));

    this.xAxis.call(xAxis);

    const yAxis = d3
      .axisLeft(this.yScale);

    this.yAxis.call(yAxis).append('text')
      .attr('transform', 'rotate(-90)')
      .attr('dy', '.75em')
      .attr('y', 6)
      .style('text-anchor', 'end')
      .attr('fill', 'currentColor')
      .text(this.translate.instant('statistics.flighthour'));

    const line = d3
      .line()
      .x(d => d[0])
      .y(d => d[1]);

    const points: [number, number][] = statisticsList.map(d => [
      this.xScale(new Date(d.date)),
      this.yScale(d.hourTime),
    ]);

    this.lineGroup.attr('d', line(points));

    this.svg.selectAll('myCircles')
      .data(statisticsList)
      .enter()
      .append('circle')
      .attr('fill', 'white')
      .attr('stroke', this.color)
      .style('stroke-width', 2)
      .attr('cx', (d: any) => this.xScale(new Date(d.date)) + this.margin.left)
      .attr('cy', (d: any) => this.yScale(d.hourTime) + this.margin.top)
      .attr('r', 5).
      on('mouseover', (d: any, i: any) => {
        // Create a group for the popup objects
        const popup = this.svg.append('g');
        const popupHeight = 23;
        const popupWidth = 66;

        // Add a rectangle surrounding the chart
        let x;
        if (d.target.cx.animVal.value + 7 + popupWidth > this.width) {
          x = d.target.cx.animVal.value - 7 - popupWidth;
        } else {
          x = d.target.cx.animVal.value + 7;
        }
        let y;
        if (d.target.cy.animVal.value - (popupHeight / 2) > this.height - popupHeight) {
          y = this.height - popupHeight + this.margin.top;
        } else if (d.target.cy.animVal.value - (popupHeight / 2) < 0) {
          y = 0 + this.margin.top;
        } else {
          y = d.target.cy.animVal.value - (popupHeight / 2);
        }
        popup
          .append('rect')
          .attr('x', x)
          .attr('y', y)
          .attr('width', popupWidth)
          .attr('height', popupHeight)
          .attr('rx', 5)
          .attr('ry', 5)
          .attr('class', 'popup')
          .style('fill', 'rgb(219 232 255)')
          .style('stroke', this.color)
          .style('stroke-width', 2);

        // Add the series value text
        const formattedTime = (i.time === 0) ? '00:00:00' : new HoursFormatPipe().transform(i.time);
        popup
          .append('text')
          .attr('x', x + 10)
          .attr('y', y + 15)
          .attr('class', 'popup')
          .text(formattedTime)
          .style('font-family', 'sans-serif')
          .style('font-size', 12)
          .style('fill', 'black');
      })
      .on('mouseout', function() {
        d3Selection.selectAll('.lineChart svg .popup').remove();
      });
  }

  public displayLineChart(statisticsList: FlightStatistic[]) {
    d3Selection.selectAll('.lineChart svg').remove();
    const slice: any[] = [];
    statisticsList.forEach((element: FlightStatistic) => {
      if (element.year != '') {
        const newVal: any = element;
        newVal.date = moment(`${element.year}-01-01`); // Convert year to date
        newVal.hourTime = (element.time / 60) / 60; // Convert second to hours
        slice.push(newVal);
      }
    });
    this.initializeChart(slice);
    this.drawChart(slice);
  }

  ngOnInit() { }

}
