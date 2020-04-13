import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService) { }

  canActivate(): boolean {
    console.log('LOGIN', this.authService.isLoggedIn());

    if (this.authService.isLoggedIn()) {
      return true;
    }
    this.authService.login();
    return false;
  }

}
