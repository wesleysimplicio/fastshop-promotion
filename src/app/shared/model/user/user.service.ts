import { AuthoritiesService } from './../../authorities/authorities.service';
import { User } from './user.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { CookieEnum } from '../../enum/cookie.enum';
import { TokenService } from '../../services/token.service';

const USER_LOGGED = 'user-logged';

@Injectable({providedIn: 'root'})
export class UserService {

  constructor(
    private tokenService: TokenService,
    private cookieService: CookieService,
    private authoritiesService: AuthoritiesService
    ) {}

  isLogged(): boolean {
    return this.tokenService.hasToken();
  }

  getUserLogged() : User{
    return JSON.parse(window.localStorage.getItem(USER_LOGGED)) as User;
  }

  setUserLogged(data: string): void {
    window.localStorage.setItem(USER_LOGGED, data);
  }

  removeUserLogged(): void {
    window.localStorage.removeItem(USER_LOGGED);
  }

  removeCredentials(): void {
    this.removeUserLogged();
    this.tokenService.removeToken();
    this.cookieService.delete(CookieEnum.PASSPORT_USER_KEY, '/', '.fastshop.com.br');
    window.localStorage.setItem('PROMO_LOGOUT', '1');
    this.authoritiesService.removeAuthorities();
  }
}
