
import { User } from './user.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { CookieEnum } from '../../enum/cookie.enum';
import { environment } from 'src/environments/environment';
import { TokenService } from '../../services/token.service';

const USER_LOGGED = 'user-logged';

@Injectable({providedIn: 'root'})
export class UserService {

  private userLoggedSubject = new BehaviorSubject<User>(null);
  private accessLevelSubject = new Subject<void>();

  constructor(
    private tokenService: TokenService,
    private cookieService: CookieService
    ) {}

  isLogged(): boolean {
    return this.tokenService.hasToken();
  }

  getUserLogged() {
    return window.localStorage.getItem(USER_LOGGED);
  }

  setUserLogged(data: string): void {
    window.localStorage.setItem(USER_LOGGED, data);
  }

  getUserLoggedSubject(): Observable<User> {
    return this.userLoggedSubject;
  }

  notifyUserLoggedSubject(): void {
    const userSubject = this.getUserLogged();
    this.userLoggedSubject.next(JSON.parse(userSubject));
  }

  notifyAccessLevelSubject(): void {
    this.accessLevelSubject.next();
  }

  getAccessLevelSubject(): Observable<void> {
    return this.accessLevelSubject;
  }

  removeUserLogged(): void {
    window.localStorage.removeItem(USER_LOGGED);
  }

  removeCredentials(): void {
    this.removeUserLogged();
    this.tokenService.removeToken();
    this.cookieService.delete(CookieEnum.PASSPORT_USER_KEY, '/', '.fastshop.com.br');
    window.location.href = environment.logout;
  }

}
