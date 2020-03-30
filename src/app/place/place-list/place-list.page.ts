import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { NavController, IonInfiniteScroll } from '@ionic/angular';
import { PlaceService } from '../place.service';
import { Place } from '../place';

@Component({
  selector: 'app-place-list',
  templateUrl: './place-list.page.html',
  styleUrls: ['./place-list.page.scss'],
})
export class PlaceListPage implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;

  places: Place[] = [];
  limit = 50;

  constructor(
    public navCtrl: NavController,
    private placeService: PlaceService
  ) {
    if (this.placeService.places.length === 0) {
      this.placeService.getPlaces({ limit: this.limit }).subscribe((res: Place[]) => {
        this.places.push(...this.placeService.places);
      });
    }
  }

  ngOnInit() {
  }

  itemTapped(event: MouseEvent, place: Place) {
    this.navCtrl.navigateForward(`places/${place.id}`);
  }

  loadData(event: any) {
    this.placeService.getPlaces({ limit: this.limit, offset: this.placeService.places.length }).subscribe((res: Place[]) => {
      event.target.complete();
      this.places = this.placeService.places;
      if (res.length < this.limit) {
        event.target.disabled = true;
      }
    });
  }

  ionViewWillEnter() {
    this.places = this.placeService.places;
  }
}
