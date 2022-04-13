import { Component, Input, OnInit } from "@angular/core";
import { D3Service } from "../d3.service";
import {CountryStatistic} from '../../flight/shared/countryStatistic.model';
import {FlightStatistic} from '../../flight/shared/flightStatistic.model';
import { TranslateService } from '@ngx-translate/core';
import { Countries, Country } from 'src/app/place/shared/place.countries';

@Component({
    selector: 'pie-chart',
    templateUrl: './pie-chart.component.html',
    styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements OnInit {
    @Input("pieData") private pieData: CountryStatistic[] = [];
    @Input("textColor") private textColor: string = "#ffffff";
    @Input("isPercentage") private isPercentage: boolean = false;
    @Input("enablePolylines") private enablePolylines: boolean = false;

    public chartId;
    private svg;
    private margin = 25;
    private width = 750;
    private height = 450;
    private lang;
    private countries: Country[] = Countries;

    // The radius of the pie chart is half the smallest side
    private radius = Math.min(this.width, this.height) / 2 - this.margin;

    private colors;
    constructor(
        private d3: D3Service,
        private translate: TranslateService
    ) {
        this.chartId = this.d3.generateId(5);
        this.lang = this.translate.currentLang;
    }

    public displayPieChart(statistics: FlightStatistic) {
        this.pieData = statistics.countries;
        this.createSvg();
        this.createColors();
        this.drawChart();
    }

    ngOnInit() {}

    private createSvg(): void {
        this.svg = this.d3.d3
            .select("pie-chart")
            .append("svg")
            .attr("viewBox", `0 0 ${this.width} ${this.height}`)
            // .attr('width', this.width)
            //.attr('height', this.height)
            .append("g")
            .attr(
                "transform",
                "translate(" + this.width / 2 + "," + this.height / 2 + ")"
            );
    }

    private createColors(data = this.pieData): void {
        this.colors = this.d3.d3
            .scaleOrdinal(this.d3.d3.schemeCategory10);
    }

    private drawChart(data = this.pieData): void {
        data.forEach((element: CountryStatistic) => {
            element.code = this.countries.find(x => x.code === element.code).name[this.lang];
        });
        // Compute the position of each group on the pie
        const pie = this.d3.d3.pie<any>().value((d: any) => Number(d.count));
        const data_ready = pie(data);

        // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
        let radius = Math.min(this.width, this.height) / 2 - this.margin;

        let outerArc = this.d3.d3
            .arc()
            .innerRadius(radius * 0.9)
            .outerRadius(radius * 0.9);

        // The arc generator
        let arc = this.d3.d3
            .arc()
            .innerRadius(radius * 0.5) // This is the size of the donut hole
            .outerRadius(radius * 0.8);

        // append the svg object to the div called 'my_dataviz'

        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        this.svg
            .selectAll("pieces")
            .data(data_ready)
            .enter()
            .append("path")
            .attr(
                "d",
                this.d3.d3
                    .arc()
                    .innerRadius(0)
                    .outerRadius(this.radius)
            )
            .attr("fill", (d, i) => (this.colors(i)))
            .attr("stroke", "#121926")
            .style("stroke-width", "1px");
        // Now add the annotation. Use the centroid method to get the best coordinates
        const labelLocation = this.d3.d3
            .arc()
            .innerRadius(50)
            .outerRadius(this.radius);
        let dy = 0;
        let index = 0;
        this.svg
            .selectAll("pieces")
            .data(pie(data))
            .enter()
            .append("text")
            .text(d => {
                if (
                    ((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100 > 5 ||
                    !this.enablePolylines
                ) {
                    return (
                        d.data.code +
                        " (" +
                        d.data.count +
                        (this.isPercentage ? "%" : "") +
                        ")"
                    );
                }
            })
            .attr("transform", d => "translate(" + labelLocation.centroid(d) + ")")
            .style("text-anchor", "middle")
            .style("font-size", 28)
            .attr("fill", this.textColor);
        if (this.enablePolylines) {
            this.svg
                .selectAll("allLabels")
                .data(data_ready)
                .enter()
                .append("text")
                .text(d => {
                    if (((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100 > 5) {
                        return null;
                    } else {
                        return (
                            d.data.code +
                            " (" +
                            d.data.count +
                            (this.isPercentage ? "%" : "") +
                            ")"
                        );
                    }
                })
                .style("font-size", "28px")
                .attr("dy", d => {
                    if (((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100 > 5) {
                        return null;
                    } else {
                        let value = 0.35;
                        if (index != 0) dy = dy + 1;
                        index++;
                        value = value + dy;
                        return value.toString() + "em";
                    }
                })
                .attr("transform", d => {
                    if (((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100 > 5) {
                        return null;
                    } else {
                        let pos = outerArc.centroid(d);
                        let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                        pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                        return "translate(" + pos + ")";
                    }
                })
                .style("text-anchor", d => {
                    let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                    return midangle < Math.PI ? "start" : "end";
                });
            index = 0;
            let addTo = 5;
            this.svg
                .selectAll("allPolylines")
                .data(data_ready)
                .enter()
                .append("polyline")
                .attr("stroke", "black")
                .style("fill", "none")
                .attr("stroke-width", 1)
                .attr("points", d => {
                    if (((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100 > 5) {
                        return null;
                    } else {
                        let posA = arc.centroid(d); // line insertion in the slice
                        let posB = outerArc.centroid(d); // line break: we use the other arc generator that has been built only for that
                        let posC = outerArc.centroid(d); // Label position = almost the same as posB
                        let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; // we need the angle to see if the X position will be at the extreme right or extreme left
                        posC[0] = radius * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
                        posC[0] = posC[0] + addTo;
                        posC[1] = posC[1] + addTo;
                        addTo = addTo + 10;
                        return [posA, posB, posC];
                    }
                });
        }
    }
}
