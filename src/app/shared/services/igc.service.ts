import { Injectable } from '@angular/core';
import IGCParser from 'igc-parser';
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
      return new Promise((resolve, reject) => {
        const igc = new Igc();
      const igcFile: any = IGCParser.parse(igcData, { lenient: true });
      // @Hack: Isolate use of xc-score library in worker to isolate the side effects
      const worker = new Worker(new URL('../workers/xc-score.worker.ts', import.meta.url))

      worker.addEventListener('message', async({ data }) => {
        const result = data;
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

          const startFixe = result.opt.flight.fixes[result.opt.flight.ll[0].launch];
          const landingFixe = result.opt.flight.fixes[result.opt.flight.ll[0].landing];
          const timeInMillisecond = landingFixe.timestamp - startFixe.timestamp
          flight.time = new Date(timeInMillisecond).toISOString().substr(11, 8);
          
          if (igcFile.gliderType && igcFile.gliderType != '') {
            flight.glider = await this.gliderService.getGliderByName(igcFile.gliderType).toPromise();
          }
        }
  
        flight.igc = igc;
        resolve(igcData);
      })

      worker.postMessage(igcFile);
      });
    }
    return null;
  }
}
