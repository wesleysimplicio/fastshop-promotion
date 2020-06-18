import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserService } from '../model/user/user.service';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  canActivate(): boolean {

    if (!this.userService.isLogged()) {
      this.router.navigate(['/login']);

      return false;
    }

    return true;
  }

}
