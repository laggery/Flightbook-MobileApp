import { Component, OnInit } from '@angular/core';
import { Glider } from 'src/app/models/glider';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-glider-list',
  templateUrl: './glider-list.page.html',
  styleUrls: ['./glider-list.page.scss'],
})
export class GliderListPage implements OnInit {
  gliders = [];

  constructor(public navCtrl: NavController) {
    const g1 = new Glider();
    g1.id = 1;
    g1.brand = 'Ozone';
    g1.name = 'Delta 2';
    g1.tandem = false;
    g1.buy_date = new Date();
    g1.user_id = 1;

    this.gliders.push(g1);
  }

  ngOnInit() {
  }

  itemTapped(event, glider) {
    this.navCtrl.navigateForward(`glider/${glider.id}`);
  }

}
