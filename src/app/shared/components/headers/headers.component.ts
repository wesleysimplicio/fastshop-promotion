import { environment } from '../../../../environments/environment';
import { Observable, Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../model/user/user.model';
import { UserService } from '../../model/user/user.service';
import { AccessLevel } from '../../enum/access-level.enum';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.scss']
})
export class HeadersComponent implements OnInit, OnDestroy {

  userLoggedSubject$: Observable<User>;
  private subscriptions = new Subscription();
  accessLevel = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getUserLoggedSubject();
    //this.getAccessLevelSubject();
    this.userService.notifyUserLoggedSubject();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onLoginClicked() {
    this.authService.login();
  }

  private getUserLoggedSubject(): void {
    this.userLoggedSubject$ = this.userService.getUserLoggedSubject();
  }

  private getAccessLevelSubject(): void {
    this.subscriptions = this.userService.getAccessLevelSubject().subscribe(() => this.verifyAccessLevel());
  }

  private verifyAccessLevel(): void {
    const user = JSON.parse(this.userService.getUserLogged()) as User;
    const gerencial = AccessLevel.GERENCIAL;
    const gerancial2 = AccessLevel.GERANCIAL2;
    const operacional = AccessLevel.OPERACIONAL;

    if (user && user.permissions.some(el => el === gerencial) || user.permissions.some(el => el === gerancial2)) {
      this.accessLevel = true;
      return;
    }

    if (user && !user.permissions.some(el => el === operacional)) {
      this.router.navigate(['/usuario-nao-autorizado']);
    }

    if (user && user.permissions.some(el => el === operacional) && this.environmentLocal()) {
      this.accessLevel = true;
    }
  }

  private environmentLocal(): boolean {
    const env = environment;
    return env.production === false;
  }

  logout(): void {
    this.userService.removeCredentials();
  }

}
