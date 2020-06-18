import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserService } from '../model/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  canActivate(): boolean {
    console.log('AQUI');

    if (!this.userService.isLogged()) {
      this.router.navigate(['/login']);
      console.log('FALSE LOGIN');

      return false;
    }

    console.log('TRUE LOGIN');

    return true;
  }

}
