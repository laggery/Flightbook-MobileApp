import { Component, OnInit } from '@angular/core';
import { Glider } from 'src/app/models/glider';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-glider-edit',
  templateUrl: './glider-edit.page.html',
  styleUrls: ['./glider-edit.page.scss'],
})
export class GliderEditPage implements OnInit {
  private gliderId: number;
  glider: Glider;

  constructor(private activeRoute: ActivatedRoute) {
    // TODO replace with data
    this.gliderId = +this.activeRoute.snapshot.paramMap.get('id');
    this.glider = new Glider();
    this.glider.id = 1;
    this.glider.brand = 'Ozone';
    this.glider.name = 'Delta 2';
    this.glider.tandem = false;
    this.glider.buy_date = new Date();
   }

  ngOnInit() {
  }

  saveGlider(glider: Glider) {
    console.log('save glider');
  }

}
