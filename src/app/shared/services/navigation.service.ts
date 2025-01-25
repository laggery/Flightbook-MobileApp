import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { NavigationEnd, Router, RoutesRecognized } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private MAX_HISTORY_LEN = 5; // prevent history from growing indefinitely
  private history: string[] = [];

  constructor(private router: Router, private location: Location) {
    this.router.events.subscribe((event) => {
      if (event instanceof RoutesRecognized) {
        this.history.push(event.url);
        if (this.history.length > this.MAX_HISTORY_LEN) {
          this.history.shift();
        }
      }
    });
  }

  back(): void {
    this.history.pop();
    if (this.history.length > 0 && this.previsousIsNotRegister()) {
      this.location.back();
    } else {
      this.router.navigateByUrl('/');
    }
  }

  private previsousIsNotRegister(): boolean {
    return this.history[this.history.length - 2] !== '/register' && this.history[this.history.length - 1] !== '/register';
  }
}
