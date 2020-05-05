import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { User } from '../user';
import { AccountService } from '../account.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  registerData: User;

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private accountService: AccountService
  ) {
    this.menuCtrl.enable(false);
    this.registerData = new User();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  saveRegister(registerForm: any){
    if (registerForm.valid) {
      this.accountService.register(this.registerData).pipe(takeUntil(this.unsubscribe$)).subscribe((res: User) => {
        // TODO hide loading
        this.router.navigate(['/login'], { replaceUrl: true });
      });
    }
  }

}
