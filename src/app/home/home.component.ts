import { User } from './../shared/model/user/user.model';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../shared/services/auth.service';
import { UserService } from '../shared/model/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user = new User();

  constructor(
    private router: Router,
    public service: AuthService,
    private userService: UserService,

  ) { }

  ngOnInit() {
    this.service.completeAuthentication().then();
    this.hasUserLogged();
  }

  private hasUserLogged(): void {
    this.user = this.userService.getUserLogged();
    if (!this.user) {
      this.router.navigate(['/login']);
    }
  }

}
