import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Passport } from '../shared/model/login/passport.model';
import { PassportUserService } from '../shared/services/passport-user-service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private passportUserService: PassportUserService,
    private router: Router,
    private loading: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.loading.show();
    this.getPassport();
  }

  private getPassport() {
    const passport = this.passportUserService.get();
    passport ? this.login(passport) : window.location.href = environment.login;
  }

  private login = (passport: Passport) => {
    this.router.navigate(['/promotion']);
  }

}
