import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FlightStatistic } from 'flightbook-commons-library';

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';

@Component({
  selector: 'bar-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnInit {

  width: number;
  height: number;
  margin = { top: 20, right: 20, bottom: 30, left: 40 };
  x: any;
  y: any;
  svg: any;
  g: any;

  constructor() {
    this.width = 900 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
  }

  private initSvg() {
    this.svg = d3.select('#barChart')
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
    this.y.domain([0, d3Array.max(statisticsList, (d: any) => d.nbFlights)]);
  }

  private drawAxis() {
    // x axis -> Years
    this.g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3Axis.axisBottom(this.x));

    // y left axis -> nb flights
    this.g.append('g')
      .attr('class', 'axis axis--yLeft')
      .call(d3Axis.axisLeft(this.y))
      .append('text')
      .attr('class', 'axis-title')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '-3.7em')
      .attr("stroke", "black")
      .attr('text-anchor', 'end')
      .text('Anzahl Flüge');
  }

  private drawBars(statisticsList: FlightStatistic[]) {
    let rectG = this.g.selectAll('.bar')
      .data(statisticsList)
      .enter().append('g')

    rectG.append("rect")
      .attr('class', 'bar-nbFlight')
      .attr('x', (d: any) => this.x(d.year))
      .attr('y', (d: any) => this.y(d.nbFlights))
      .attr('width', this.x.bandwidth())
      .attr('height', (d: any) => this.height - this.y(d.nbFlights))
      .attr('fill', '#3880ff');

    rectG
      .append('text')
      .attr('x', (d: any) => {
        return this.x(d.year) + (this.x.bandwidth() - ((this.x.bandwidth()  / 2) + d.nbFlights.toString().length * 5))
      } )
      .attr('y', (d: any) => this.y(d.nbFlights) + 17)
      .attr('fill', 'white')
      .text((d: any) => {
        return d.nbFlights;
      });
  }

  public displayBarChart(statisticsList: FlightStatistic[]) {
    d3.selectAll('svg').remove();
    this.initSvg();
    this.initAxis(statisticsList);
    this.drawAxis();
    this.drawBars(statisticsList);
  }

  ngOnInit() { }

}
