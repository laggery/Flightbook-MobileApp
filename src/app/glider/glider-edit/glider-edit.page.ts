import { Component, OnInit } from '@angular/core';
import { Glider } from 'src/app/glider/glider';
import { ActivatedRoute, Router } from '@angular/router';
import { GliderService } from '../glider.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-glider-edit',
  templateUrl: './glider-edit.page.html',
  styleUrls: ['./glider-edit.page.scss'],
})
export class GliderEditPage implements OnInit {
  private gliderId: number;
  glider: Glider;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private gliderService: GliderService
  ) {
    this.gliderId = +this.activeRoute.snapshot.paramMap.get('id');
    this.glider = this.gliderService.gliders.find(glider => glider.id === this.gliderId);
    this.glider = _.cloneDeep(this.glider);
    if (!this.glider) {
      this.router.navigate(['/gliders'], { replaceUrl: true });
    }
  }

  ngOnInit() {
  }

  saveGlider(glider: Glider) {
    this.gliderService.putGlider(glider).subscribe((res: Glider) => {
      // TODO hide loading
      this.router.navigate(['/gliders'], { replaceUrl: true });
    });
  }

}
