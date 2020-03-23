import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { User } from '../../models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerData: User;

  constructor(private menuCtrl: MenuController) {
    this.menuCtrl.enable(false);
    this.registerData = new User();
  }

  ngOnInit() {
  }

  saveRegister(registerForm){
    console.log('save register');
  }

}
