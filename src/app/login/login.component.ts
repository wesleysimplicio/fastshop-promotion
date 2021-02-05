import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from './../shared/model/user/user.model';
import { PassportUserService } from '../shared/services/passport-user-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from '../shared/model/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user = new User();

  constructor(
    private passportUserService: PassportUserService,
    private router: Router,
    private loading: NgxSpinnerService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.loading.show();
  }

  logout(): void {
    this.userService.removeCredentials();
  }
}
