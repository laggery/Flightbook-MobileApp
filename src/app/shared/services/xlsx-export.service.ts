import { Injectable } from '@angular/core';
import * as fileSaver from 'file-saver';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Place } from '../../place/shared/place.model';
import { HoursFormatPipe } from 'src/app/shared/pipes/hours-format.pipe';
import { Flight } from 'src/app/flight/shared/flight.model';
import { Glider } from 'src/app/glider/shared/glider.model';
import { Countries, Country } from 'src/app/place/shared/place.countries';
import { MapUtil } from '../util/MapUtil';
import { PassengerConfirmation } from 'src/app/tandem/shared/domain/passenger-confirmation.model';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class XlsxExportService {

  XLSX: any;
  countries: Country[] = Countries;
  lang : string;

  constructor(private translate: TranslateService) {
    this.lang = this.translate.currentLang;
  }

  async loadXlsx() {
    if (!this.XLSX) {
      this.XLSX = await import('xlsx');
    }
  }

  public async generateFlightsXlsxFile(flights: Flight[], writeOptions: any): Promise<any> {
    return await this.generateFlightbookXlsxFile(flights, null, null, null, writeOptions);
  }

  public async generateGlidersXlsxFile(gliders: Glider[], writeOptions: any): Promise<any> {
    return await this.generateFlightbookXlsxFile(null, gliders, null, null, writeOptions);
  }

  public async generatePlacesXlsxFile(places: Place[], writeOptions: any): Promise<any> {
    return await this.generateFlightbookXlsxFile(null, null, places, null, writeOptions);
  }

  public async generatePassengerConfirmationsXlsxFile(passengerConfirmations: PassengerConfirmation[], writeOptions: any): Promise<any> {
    return await this.generateFlightbookXlsxFile(null, null, null, passengerConfirmations, writeOptions);
  }

  public async generateFlightbookXlsxFile(flights: Flight[], gliders: Glider[], places: Place[], passengerConfirmations: PassengerConfirmation[], writeOptions: any): Promise<any> {
    if (!flights && !gliders && !places && !passengerConfirmations) {
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

    if (passengerConfirmations) {
      workbook.Sheets.passengerConfirmations = this.passengerConfirmationSheet(passengerConfirmations);
      workbook.SheetNames.push('passengerConfirmations');
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
      flatFlight[this.translate.instant('flight.startCountry')] = flight.start?.country ? this.countries.find(x => x.code === flight.start?.country).name[this.lang] : "";
      flatFlight[this.translate.instant('flight.landing')] = flight.landing?.name;
      flatFlight[this.translate.instant('flight.landingCountry')] = flight.landing?.country ? this.countries.find(x => x.code === flight.landing?.country).name[this.lang] : "";
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
      flatGlider[this.translate.instant('glider.note')] = glider.note
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
      flatPlace[this.translate.instant('place.country')] = place.country ? this.countries.find(x => x.code === place.country).name[this.lang] : "";
      let point: any = MapUtil.convertEPSG3857ToEPSG4326(place.coordinates)
      flatPlace[this.translate.instant('place.coordinates')] = point ? `${point.flatCoordinates[1]}, ${point.flatCoordinates[0]}` : "";
      flatPlace[this.translate.instant('place.notes')] = place.notes;
      list.push(flatPlace);
    })

    return this.XLSX.utils.json_to_sheet(list);
  }

  private passengerConfirmationSheet(passengerConfirmations: PassengerConfirmation[]): any {
    let list: any = [];
    passengerConfirmations.forEach((passengerConfirmation: PassengerConfirmation) => {
      let flatPassengerConfirmation: any = [];
      flatPassengerConfirmation[this.translate.instant('account.firstname')] = passengerConfirmation.firstname;
      flatPassengerConfirmation[this.translate.instant('account.lastname')] = passengerConfirmation.lastname;
      flatPassengerConfirmation[this.translate.instant('login.email')] = passengerConfirmation.email;
      flatPassengerConfirmation[this.translate.instant('account.phone')] = passengerConfirmation.phone;
      flatPassengerConfirmation[this.translate.instant('passengerConfirmation.fullyUnderstoodInstructions')] = passengerConfirmation.validation.fullyUnderstoodInstructions ? this.translate.instant('buttons.yes') : this.translate.instant('buttons.no');
      flatPassengerConfirmation[this.translate.instant('passengerConfirmation.undertakePilotInstructions')] = passengerConfirmation.validation.undertakePilotInstructions ? this.translate.instant('buttons.yes') : this.translate.instant('buttons.no');
      flatPassengerConfirmation[this.translate.instant('passengerConfirmation.noHealthProblems')] = passengerConfirmation.validation.noHealthProblems ? this.translate.instant('buttons.yes') : this.translate.instant('buttons.no');
      flatPassengerConfirmation[this.translate.instant('passengerConfirmation.understandRisks')] = passengerConfirmation.validation.understandRisks ? this.translate.instant('buttons.yes') : this.translate.instant('buttons.no');
      flatPassengerConfirmation[this.translate.instant('passengerConfirmation.canUseData')] = passengerConfirmation.canUseData ? this.translate.instant('buttons.yes') : this.translate.instant('buttons.no');
      flatPassengerConfirmation[this.translate.instant('place.name')] = passengerConfirmation.place;
      flatPassengerConfirmation[`${this.translate.instant('passengerConfirmation.signature')} (Base64)`] = passengerConfirmation.signature;
      flatPassengerConfirmation["Media types (MIME type)"] = passengerConfirmation.signatureMimeType;
      list.push(flatPassengerConfirmation);
    })

    return this.XLSX.utils.json_to_sheet(list);
  }
}
