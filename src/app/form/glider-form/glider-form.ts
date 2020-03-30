import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Glider } from '../../glider/glider';

@Component({
  selector: 'glider-form',
  templateUrl: 'glider-form.html'
})
export class GliderFormComponent {
  @Input()
  glider: Glider;
  @Output()
  saveGlider = new EventEmitter<Glider>();

  constructor() {
  }

  saveElement() {
    this.saveGlider.emit(this.glider);
  }

  cancelButton() {
    this.glider.buyDate = null;
  }

}
