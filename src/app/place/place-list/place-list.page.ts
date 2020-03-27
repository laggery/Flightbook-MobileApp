import { Component, OnInit, ViewChild } from '@angular/core';
import { Place } from '../../models/place';
import { NavController, IonInfiniteScroll } from '@ionic/angular';
import { PlaceService } from '../place.service';

@Component({
  selector: 'app-place-list',
  templateUrl: './place-list.page.html',
  styleUrls: ['./place-list.page.scss'],
})
export class PlaceListPage implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;

  places = [];
  limit = 50;

  constructor(
    public navCtrl: NavController,
    private placeService: PlaceService,
  ) {
    if (this.placeService.places.length === 0) {
      this.placeService.getPlaces({limit: this.limit}).subscribe(res => {
        this.places.push(...this.placeService.places);
      });
    } else {
      this.places.push(...this.placeService.places);
    }
  }

  ngOnInit() {
  }

  itemTapped(event, place) {
    this.navCtrl.navigateForward(`place/${place.id}`);
  }

  loadData(event) {
    this.placeService.getPlaces({limit: this.limit, offset: this.placeService.places.length}).subscribe(res => {
      event.target.complete();
      this.places = this.placeService.places;
      if (res.length < this.limit) {
        event.target.disabled = true;
      }
    });
  }
}
