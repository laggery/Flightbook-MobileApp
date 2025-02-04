import { KeyValue } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
    name: 'nxgTransalteSort',
    standalone: true
})
export class NxgTransalteSortPipe implements PipeTransform {

  constructor(
    private translate: TranslateService
  ) {}

  transform(value: any[], ...args: unknown[]): any[] {
    if (value === null || value === undefined) {
      return value;
    }
    return value.sort((a, b) => {
      if (isNaN(parseInt(this.translate.instant('controlSheet.' + args[0] + '.' + b.key + '.order')))) {
        return -1;
      }
      return parseInt(this.translate.instant('controlSheet.' + args[0] + '.' + a.key + '.order')) - parseInt(this.translate.instant('controlSheet.' + args[0] + '.' + b.key + '.order'));
    });
  }

}
