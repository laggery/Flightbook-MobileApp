import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Flight } from 'src/app/flight/shared/flight.model';
import { Glider } from 'src/app/glider/shared/glider.model';

@Component({
  selector: 'fb-glider-select',
  templateUrl: './glider-select.component.html',
  styleUrls: ['./glider-select.component.scss'],
})
export class GliderSelectComponent implements OnInit {

  @Input()
  gliders: Glider[];

  @Input()
  flight: Flight;

  @Input()
  label: string;

  @Input()
  labelPlacement: string;

  constructor() { }

  ngOnInit() {}

  onSelectChange(selectedValue: any) {
    this.flight.glider = this.gliders.find(glider => glider.id === +selectedValue.detail.value);
    if (!this.flight.glider.tandem) {
      this.flight.price = null;
    }
  }

}
