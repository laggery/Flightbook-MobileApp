import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { Flight } from 'src/app/flight/shared/flight.model';
import { User } from '../../account/shared/user.model';

@Injectable({
  providedIn: 'root'
})
export class PdfExportService {

  pdfMake: any;

  constructor(private datePipe: DatePipe, private translate: TranslateService) { }

  async loadPdfMaker() {
    if (!this.pdfMake) {
      const pdfMakeModule = await import('pdfmake/build/pdfmake');
      const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
      this.pdfMake = pdfMakeModule;
      this.pdfMake.vfs = pdfFontsModule.pdfMake.vfs;
    }
  }

  async generatePdf(flights: Flight[], user: User, generateFrom?: string): Promise<any> {
    await this.loadPdfMaker();

    if (!generateFrom) {
      generateFrom = 'https://flightbook.ch';
    }

    let flightList: any = [];
    let startPlaces = new Set();
    let landingPlaces = new Set();
    flights.forEach((flight: Flight) => {

      if (flight.start) {
        startPlaces.add(JSON.stringify(flight.start));
      }

      if (flight.landing) {
        landingPlaces.add(JSON.stringify(flight.landing));
      }

      flightList.push([
        { text: flight.number, style: 'tableRow' },
        { text: this.datePipe.transform(flight.date, 'dd.MM.yyyy'), style: 'tableRow' },
        { text: `${flight.glider.brand} ${flight.glider.name}`, style: 'tableRow' },
        { text: flight.start?.name, style: 'tableRow' },
        { text: flight.landing?.name, style: 'tableRow' },
        { text: flight.time, style: 'tableRow' },
        { text: flight.km, style: 'tableRow' },
        { text: flight.description, style: 'tableRow' }
      ])
    })

    let startPlacesList: any = [];
    startPlaces.forEach((jsonPlace: string) => {
      let place = JSON.parse(jsonPlace);
      startPlacesList.push([
        { text: place.name, style: 'tableRow' },
        { text: place.altitude, style: 'tableRow' },
      ]);
    })

    let landingPlacesList: any = [];
    landingPlaces.forEach((jsonPlace: string) => {
      let place = JSON.parse(jsonPlace);
      landingPlacesList.push([
        { text: place.name, style: 'tableRow' },
        { text: place.altitude, style: 'tableRow' },
      ]);
    })

    let docDefinition: TDocumentDefinitions = {
      pageMargins: [40, 40, 40, 80],
      footer: (currentPage, pageCount, options) => {
        let signatureColor = 'white';
        if (options.orientation === 'landscape') {
          signatureColor = "black";
        }
        return [
          {
            style: { color: signatureColor },
            margin: [40, 20, 0, 15],
            text: `${this.translate.instant('export.school')}: _______________________________`
          },
          {
            style: { color: 'grey' },
            columns: [
              {
                margin: [40, 0, 0, 0],
                style: { alignment: "left" },
                text: generateFrom
              },
              {
                style: { alignment: "center" },
                text: `${currentPage.toString()}/${pageCount}`
              },
              {
                margin: [0, 0, 40, 0],
                style: { alignment: "right" },
                text: this.datePipe.transform(new Date(), 'dd.MM.yyyy')
              }
            ]
          }];
      },
      header: (currentPage, pageCount, options) => {
        let header: any = {};
        if (currentPage != 1) {
          header = {
            columns: [
              {
                margin: [40, 20, 0, 0],
                style: { alignment: "left", },
                text: `${this.translate.instant('export.pilote')}: ${user.firstname} ${user.lastname}`
              },
              {
                style: { alignment: "left" },
                text: ``
              },
              {
                style: { alignment: "left" },
                text: ""
              }
            ]
          };
        }
        return header;
      },
      content: [
        { text: this.translate.instant('flightbook'), style: "h1" },
        {
          margin: [0, 10, 0, 0],
          columns: [
            {
              text: `${this.translate.instant('export.firstlastname')}: ${user.firstname} ${user.lastname}`
            },
            {
              text: `${this.translate.instant('login.email')}: ${user.email}`
            }
          ]
        },
        {
          margin: [0, 10, 0, 0],
          text: `${this.translate.instant('export.nbStartplaces')}: ${startPlaces.size}`
        },
        { text: `${this.translate.instant('export.nbLandingplaces')}: ${landingPlaces.size}` },
        { text: `${this.translate.instant('export.nbflights')}: ${flightList.length}` },
        {
          margin: [0, 10, 0, 0],
          columns: [
            [
              {
                text: this.translate.instant('export.startplaces'), style: { bold: true }
              },
              {
                style: 'placeTable',
                table: {
                  widths: ['auto', '*'],
                  headerRows: 1,
                  body: [
                    [
                      { text: this.translate.instant('place.name'), style: 'tableHeader' },
                      { text: this.translate.instant('place.altitude'), style: 'tableHeader' }
                    ],
                    ...startPlacesList
                  ]
                },
                layout: 'lightHorizontalLines'
              },
            ],
            [
              {
                text: this.translate.instant('export.landingplaces'), style: { bold: true }
              },
              {
                style: 'placeTable',
                table: {
                  widths: ['auto', '*'],
                  headerRows: 1,
                  body: [
                    [
                      { text: this.translate.instant('place.name'), style: 'tableHeader' },
                      { text: this.translate.instant('place.altitude'), style: 'tableHeader' }
                    ],
                    ...landingPlacesList
                  ]
                },
                layout: 'lightHorizontalLines'
              },
            ],
          ]
        },
        { text: this.translate.instant('export.flights'), pageOrientation: 'landscape', pageBreak: 'before', style: { bold: true } },
        {
          style: 'flightTable',
          table: {
            widths: ['auto', 'auto', 80, 'auto', 'auto', 45, 20, '*'],
            headerRows: 1,
            body: [
              [
                { text: this.translate.instant('flight.number'), style: 'tableHeader' },
                { text: this.translate.instant('flight.date'), style: 'tableHeader' },
                { text: this.translate.instant('flight.glider'), style: 'tableHeader' },
                { text: this.translate.instant('flight.start'), style: 'tableHeader' },
                { text: this.translate.instant('flight.landing'), style: 'tableHeader' },
                { text: this.translate.instant('flight.time'), style: 'tableHeader' },
                { text: this.translate.instant('flight.km'), style: 'tableHeader' },
                { text: this.translate.instant('flight.description'), style: 'tableHeader' }
              ],
              ...flightList,
            ]
          },
          layout: 'lightHorizontalLines'
        },
      ],
      styles: {
        h1: {
          alignment: "center",
          fontSize: 14,
          bold: true
        },
        flightTable: {
          margin: [0, 10, 0, 0],
          fontSize: 10
        },
        placeTable: {
          margin: [0, 10, 5, 0],
          fontSize: 10
        }
      }
    };

    return this.pdfMake.createPdf(docDefinition, null, null, this.pdfMake.vfs);
  }
}
