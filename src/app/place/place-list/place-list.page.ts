import { Component, OnInit } from '@angular/core';
import { Place } from '../../models/place';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-place-list',
  templateUrl: './place-list.page.html',
  styleUrls: ['./place-list.page.scss'],
})
export class PlaceListPage implements OnInit {
  places = [
    {id: 1, name: 'test 1', altitude: 1, user_id: 1},
    {id: 2, name: 'test 2', altitude: 1, user_id: 1}
  ];

  constructor(public navCtrl: NavController) { }

  ngOnInit() {
  }

  itemTapped(event, place) {
    this.navCtrl.navigateForward(`place/${place.id}`);
  }

}
