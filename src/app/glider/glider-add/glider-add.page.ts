import { Component, OnInit, OnDestroy } from '@angular/core';
import { Glider } from '../glider';
import { GliderService } from '../glider.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-glider-add',
  templateUrl: './glider-add.page.html',
  styleUrls: ['./glider-add.page.scss'],
})
export class GliderAddPage implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  private glider: Glider;

  constructor(
    private router: Router,
    private gliderService: GliderService
  ) {
    this.glider = new Glider();
   }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  saveGlider(glider: Glider) {
    this.gliderService.postGlider(glider).pipe(takeUntil(this.unsubscribe$)).subscribe((res: Glider) => {
      // TODO hide loading
      this.router.navigate(['/gliders'], { replaceUrl: true });
    });
  }

}
