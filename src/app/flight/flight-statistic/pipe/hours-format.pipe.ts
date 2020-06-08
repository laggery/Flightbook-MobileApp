import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hoursFormat'
})
export class HoursFormatPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    const h = Math.floor(value / 3600);
    const m = Math.floor(value % 3600 / 60);
    const s = Math.floor(value % 3600 % 60);
    return `${this.format(h)}:${this.format(m)}:${this.format(s)}`;
  }

  private format(value: number) {
    if (value < 10) {
      return `0${value}`
    } else {
      return value;
    }
  }
}
