import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { PlaceService } from 'src/app/place/place.service';
import { Place } from 'src/app/place/place';

@Component({
  selector: 'autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class AutocompleteComponent implements OnInit {
  @Input()
  search: string;
  @Output()
  setInputValue = new EventEmitter<Place>();


  show: boolean
  listElement: Place[];

  constructor(private placeService: PlaceService, private _eref: ElementRef) {
    this.search = null;
    this.show = false;
  }

  ngOnInit() { }

  onClick(event: any) {
    if (!this._eref.nativeElement.contains(event.target)) { // or some similar check
      this.show = false;
    }
  }

  ngOnChanges() {
    if (this.search && this.search !== "") {
      this.placeService.getPlacesByName(this.search, { limit: 4 }).subscribe((res: Place[]) => {
        if (res && res.length > 0) {
          this.show = true;
          this.listElement = res
        } else {
          this.show = false;
        }
      })
    } else {
      this.show = false;
    }
  }

  setValue(value: any) {
    this.show = false;
    this.setInputValue.emit(value);
  }

  closeList() {
    this.show = false;
  }
}