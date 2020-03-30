import { Component, OnInit } from '@angular/core';
import { Glider } from '../glider';
import { GliderService } from '../glider.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-glider-add',
  templateUrl: './glider-add.page.html',
  styleUrls: ['./glider-add.page.scss'],
})
export class GliderAddPage implements OnInit {
  private glider: Glider;

  constructor(
    private router: Router,
    private gliderService: GliderService
  ) {
    this.glider = new Glider();
   }

  ngOnInit() {
  }

  saveGlider(glider: Glider) {
    this.gliderService.postGlider(glider).subscribe((res: Glider) => {
      // TODO hide loading
      this.router.navigate(['/gliders'], { replaceUrl: true });
    });
  }

}
