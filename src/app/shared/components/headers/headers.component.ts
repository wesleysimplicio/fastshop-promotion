import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription, Subject } from 'rxjs';
import { User } from '../../model/user/user.model';
import { UserService } from '../../model/user/user.service';
import { AuthService } from '../../services/auth.service';
import { AccessLevelService } from '../../services/access-level/access-level.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.scss']
})
export class HeadersComponent implements OnInit, OnDestroy {
  userLoggedSubject$ = new Subject<User>();
  private subscriptions = new Subscription();
  accessLevel = false;
  user = new User();

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private accessLevelService: AccessLevelService
  ) { }

  ngOnInit() {
    this.getUserLogged();
    this.accessPromotion();
  }

  private getUserLogged(): void {
    this.user = this.userService.getUserLogged();
  }

  private accessPromotion(): void {
    const prod = this.accessLevelService.hasAccessProd(this.user);
    const qa = this.accessLevelService.hasAccessQA(this.user);
    if (prod || qa) {
      this.router.navigate(['/promotion']);
      this.accessLevel = true;
      return;
    }
    this.router.navigate(['/usuario-nao-autorizado']);
  }


  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onLoginClicked() {
    this.authService.login();
  }

  logout(): void {
    this.userService.removeCredentials();
    window.location.href = environment.logout;
  }
}
