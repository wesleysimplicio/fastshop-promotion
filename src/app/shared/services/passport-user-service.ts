
import { Injectable } from '@angular/core';
import * as jtw_decode from 'jwt-decode';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { Passport } from '../model/login/passport.model';
import { TokenService } from './token.service';
import { CookieEnum } from '../enum/cookie.enum';
import { User } from '../model/user/user.model';
import { UserService } from '../model/user/user.service';


@Injectable({
  providedIn: 'root'
})
export class PassportUserService {

  private descryptToken: User;

  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private cookieService: CookieService
    ) {}

  public get(): Passport {

    const passportCookie = this.cookieService.get(CookieEnum.PASSPORT_USER_KEY);

    if (!passportCookie || passportCookie === '') {
      return null;
    }

    const decryptedPassportCookie = atob(passportCookie);
    const passportJson            = JSON.parse(decryptedPassportCookie);
    const passport                = passportJson[Object.keys(passportJson)[0]] as Passport;
    this.descryptToken            = this.decodeToken(passport.user.token) as User;

    if (this.invalidDate(this.descryptToken.exp)) {
      return null;
    }

    this.tokenService.setToken(passport.user.token);
    this.userService.setUserLogged(JSON.stringify(this.configUserLogged()));
    return passport;
  }

  private decodeToken(token: string) {
    return jtw_decode(token);
  }

  private invalidDate(date): boolean {
    return moment(new Date(date * 1000)).isBefore(new Date(moment.now()), 'day');
  }

  private configUserLogged(): User {
    const user = {
      email: this.descryptToken.email,
      sub: this.descryptToken.sub,
      permissions: this.descryptToken.permissions
    };
    return user;
  }
}
