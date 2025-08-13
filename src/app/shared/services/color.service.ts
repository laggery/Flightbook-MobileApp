import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  constructor() {}

  getPrimaryColor(): string {
    return this.getColorVariable('--ion-color-primary');
  }

  getIonTextColor(): string {
    return this.getColorVariable('--ion-text-color');
  }

  private getColorVariable(variableName: string): string {
    const element = document.documentElement;
    const computedStyle = getComputedStyle(element);
    return computedStyle.getPropertyValue(variableName).trim();
  }
}
