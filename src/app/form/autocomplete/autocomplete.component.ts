import { Component, OnInit, Input, Output, EventEmitter, ElementRef, OnChanges } from '@angular/core';
import { Place } from 'src/app/core/domain/place';
import { PlaceService } from 'src/app/core/services/place.service';
@Component({
  selector: 'autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class AutocompleteComponent implements OnInit, OnChanges {
  @Input()
  search: string;
  @Output()
  setInputValue = new EventEmitter<Place>();


  show: boolean;
  listElement: Place[];

  constructor(private placeService: PlaceService, private eRef: ElementRef) {
    this.search = null;
    this.show = false;
  }

  ngOnInit() { }

  onClick(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) { // or some similar check
      this.show = false;
    }
  }

  ngOnChanges() {
    if (this.search && this.search !== '') {
      this.placeService.getPlacesByName(this.search, { limit: 4 }).subscribe((res: Place[]) => {
        if (res && res.length > 0) {
          this.show = true;
          this.listElement = res;
        } else {
          this.show = false;
        }
      });
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
