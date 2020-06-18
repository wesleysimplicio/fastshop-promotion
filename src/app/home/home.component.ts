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

  constructor(
    private router: Router,
    public service: AuthService,
    private loading: NgxSpinnerService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.service.completeAuthentication().then();
    this.userService.notifyUserLoggedSubject();
    this.userService.notifyAccessLevelSubject();
    this.hasUserLogged();
  }

  private hasUserLogged(): void {
    const userLogged = this.userService.getUserLogged();
    if (!userLogged) {
      this.router.navigate(['/login']);
    }
  }

}
