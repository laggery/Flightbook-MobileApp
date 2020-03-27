import { Component, OnInit } from '@angular/core';
import { Place } from '../place';
import { Router } from '@angular/router';
import { PlaceService } from '../place.service';

@Component({
  selector: 'app-place-add',
  templateUrl: './place-add.page.html',
  styleUrls: ['./place-add.page.scss'],
})
export class PlaceAddPage implements OnInit {
  private place: Place;

  constructor(
    private router: Router,
    private placeService: PlaceService
  ) {
    this.place = new Place();
  }

  ngOnInit() {
  }

  savePlace(place: Place) {
    this.placeService.postPlace(place).subscribe((res: Place) => {
      // TODO hide loading
      this.router.navigate(['/places'], { replaceUrl: true });
    });
  }

}
