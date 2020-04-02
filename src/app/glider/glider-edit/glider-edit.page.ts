import { Component, OnInit, OnDestroy } from '@angular/core';
import { Glider } from 'src/app/glider/glider';
import { ActivatedRoute, Router } from '@angular/router';
import { GliderService } from '../glider.service';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-glider-edit',
  templateUrl: './glider-edit.page.html',
  styleUrls: ['./glider-edit.page.scss'],
})
export class GliderEditPage implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  private gliderId: number;
  glider: Glider;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private gliderService: GliderService
  ) {
    this.gliderId = +this.activeRoute.snapshot.paramMap.get('id');
    this.glider = this.gliderService.getValue().find(glider => glider.id === this.gliderId);
    this.glider = _.cloneDeep(this.glider);
    if (!this.glider) {
      this.router.navigate(['/gliders'], { replaceUrl: true });
    }
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  saveGlider(glider: Glider) {
    this.gliderService.putGlider(glider).pipe(takeUntil(this.unsubscribe$)).subscribe((res: Glider) => {
      // TODO hide loading
      this.router.navigate(['/gliders'], { replaceUrl: true });
    });
  }

}
