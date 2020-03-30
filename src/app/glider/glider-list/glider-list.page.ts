import { Component, OnInit } from '@angular/core';
import { Glider } from 'src/app/glider/glider';
import { NavController } from '@ionic/angular';
import { GliderService } from '../glider.service';

@Component({
  selector: 'app-glider-list',
  templateUrl: './glider-list.page.html',
  styleUrls: ['./glider-list.page.scss'],
})
export class GliderListPage implements OnInit {
  gliders: Glider[] = [];
  limit = 50;

  constructor(
    public navCtrl: NavController,
    private gliderService: GliderService
  ) {
    if (this.gliderService.gliders.length === 0) {
      this.gliderService.getGliders({ limit: this.limit }).subscribe((res: Glider[]) => {
        this.gliders.push(...this.gliderService.gliders);
      });
    }
  }

  ngOnInit() {
  }

  itemTapped(event: MouseEvent, glider: Glider) {
    this.navCtrl.navigateForward(`gliders/${glider.id}`);
  }

  loadData(event: any) {
    this.gliderService.getGliders({ limit: this.limit, offset: this.gliderService.gliders.length }).subscribe((res: Glider[]) => {
      event.target.complete();
      this.gliders = this.gliderService.gliders;
      if (res.length < this.limit) {
        event.target.disabled = true;
        this.gliderService.isGliderlistComplete = true;
      }
    });
  }

  ionViewWillEnter() {
    this.gliders = this.gliderService.gliders;
  }

}
