import { Injectable } from '@angular/core';
import * as IGCParser from 'igc-parser';
// import { scoringRules as scoring, solver } from 'igc-xc-score';
import { GliderService } from 'src/app/glider/shared/glider.service';
import { Flight } from 'src/app/flight/shared/flight.model';
import { Igc } from '../domain/igc.model';

@Injectable({
  providedIn: 'root'
})
export class IgcService {

  constructor(private gliderService: GliderService) { }

  async getIgcFileContentAndPrefillFlight(flight: Flight, igcFile: File, override = true): Promise<string> {
    const igcData = await igcFile.text();

    if (typeof igcData === 'string') {
      const igc = new Igc();
      const igcFile: any = IGCParser.parse(igcData, { lenient: true });
      // @TODO: fix this
      const test = await import('igc-xc-score');
      const result = test.solver(igcFile, test.scoringRules.XCScoring, {}).next().value;
      if (result.optimal) {
        if (override) {
          flight.km = result.scoreInfo.distance;
        }
        igc.start = result.scoreInfo.ep?.start;
        igc.landing = result.scoreInfo.ep?.finish;
        igc.tp = result.scoreInfo.tp;
      }

      if (override) {
        flight.date = igcFile.date;
        if (igcFile.site && igcFile.site != "") {
          flight.start.name = igcFile.site;
        }
        const startFixe = result.opt.flight.fixes[igcFile.ll[0].launch];
        const landingFixe = result.opt.flight.fixes[igcFile.ll[0].landing];
        const timeInMillisecond = landingFixe.timestamp - startFixe.timestamp
        flight.time = new Date(timeInMillisecond).toISOString().substr(11, 8);
        if (igcFile.gliderType && igcFile.gliderType != '') {
          flight.glider = await this.gliderService.getGliderByName(igcFile.gliderType).toPromise();
        }
      }

      flight.igc = igc;

      return igcData;
    }
    return null;
  }
}
