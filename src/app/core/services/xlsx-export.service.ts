import { Injectable } from '@angular/core';
import * as fileSaver from 'file-saver';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Flight } from '../domain/flight';
import { Glider } from '../domain/glider';
import { Place } from '../domain/place';
import { HoursFormatPipe } from 'src/app/shared/pipes/hours-format/hours-format.pipe';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class XlsxExportService {

  XLSX: any;

  constructor(private translate: TranslateService) { }

  async loadXlsx() {
    if (!this.XLSX) {
      this.XLSX = await import('xlsx');
    }
  }

  public async generateFlightsXlsxFile(flights: Flight[], writeOptions: any): Promise<any> {
    return await this.generateFlightbookXlsxFile(flights, null, null, writeOptions);
  }

  public async generateGlidersXlsxFile(gliders: Glider[], writeOptions: any): Promise<any> {
    return await this.generateFlightbookXlsxFile(null, gliders, null, writeOptions);
  }

  public async generatePlacesXlsxFile(places: Place[], writeOptions: any): Promise<any> {
    return await this.generateFlightbookXlsxFile(null, null, places, writeOptions);
  }

  public async generateFlightbookXlsxFile(flights: Flight[], gliders: Glider[], places: Place[], writeOptions: any): Promise<any> {
    if (!flights && !gliders && !places) {
      return null;
    }

    await this.loadXlsx();

    let workbook: any = { Sheets: {}, SheetNames: [] };
    if (flights) {
      workbook.Sheets.flights = this.flightSheet(flights);
      workbook.SheetNames.push('flights');
    }

    if (gliders) {
      workbook.Sheets.gliders = this.gliderSheet(gliders);
      workbook.SheetNames.push('gliders');
    }

    if (places) {
      workbook.Sheets.places = this.placeSheet(places);
      workbook.SheetNames.push('places');
    }

    return this.XLSX.write(workbook, writeOptions);
  }

  public saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    fileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  private flightSheet(flights: Flight[]): any {
    let list: any = [];
    flights.forEach((flight: Flight) => {
      let flatFlight: any = [];
      flatFlight[this.translate.instant('flight.number')] = flight.number;
      flatFlight[this.translate.instant('flight.date')] = moment(flight.date).format('DD.MM.YYYY');
      flatFlight[this.translate.instant('flight.start')] = flight.start?.name;
      flatFlight[this.translate.instant('flight.landing')] = flight.landing?.name;
      flatFlight[this.translate.instant('flight.time')] = flight.time;
      flatFlight[this.translate.instant('flight.km')] = flight.km;
      flatFlight[this.translate.instant('flight.price')] = flight.price;
      flatFlight[this.translate.instant('flight.description')] = flight.description;
      flatFlight[this.translate.instant('flight.glider')] = `${flight.glider.brand} ${flight.glider.name}`;
      flatFlight[this.translate.instant('glider.tandem')] = (flight.glider.tandem) ? this.translate.instant('buttons.yes') : this.translate.instant('buttons.no');
      flatFlight[this.translate.instant('flight.igcFile')] = flight.igc?.filepath;
      list.push(flatFlight);
    })

    return this.XLSX.utils.json_to_sheet(list);
  }

  private gliderSheet(gliders: Glider[]): any {
    let list: any = [];
    gliders.forEach((glider: Glider) => {
      let flatGlider: any = [];
      flatGlider[this.translate.instant('glider.brand')] = glider.brand;
      flatGlider[this.translate.instant('glider.name')] = glider.name;
      flatGlider[this.translate.instant('glider.buydate')] = (glider.buyDate) ? moment(glider.buyDate).format('DD.MM.YYYY') : "-";
      flatGlider[this.translate.instant('glider.tandem')] = (glider.tandem) ? this.translate.instant('buttons.yes') : this.translate.instant('buttons.no');
      flatGlider[this.translate.instant('statistics.nbflight')] = glider.nbFlights;
      flatGlider[this.translate.instant('statistics.flighthour')] = new HoursFormatPipe().transform(glider.time);
      list.push(flatGlider);
    })

    return this.XLSX.utils.json_to_sheet(list);
  }

  private placeSheet(places: Place[]): any {
    let list: any = [];
    places.forEach((place: Place) => {
      let flatPlace: any = [];
      flatPlace[this.translate.instant('place.name')] = place.name;
      flatPlace[this.translate.instant('place.altitude')] = place.altitude;
      list.push(flatPlace);
    })

    return this.XLSX.utils.json_to_sheet(list);
  }
}
