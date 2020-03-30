import { Component, OnInit } from '@angular/core';
import { Glider } from '../glider';

@Component({
  selector: 'app-glider-add',
  templateUrl: './glider-add.page.html',
  styleUrls: ['./glider-add.page.scss'],
})
export class GliderAddPage implements OnInit {
  private glider: Glider;

  constructor() {
    this.glider = new Glider();
   }

  ngOnInit() {
  }

  saveGlider(glider: Glider) {
    console.log('save glider');
  }

}
