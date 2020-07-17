import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from './shared/model/user/user.service';
import { Router } from '@angular/router';
import { UtilitiesService } from './shared/services/utilities.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public title = 'FastShopPromotion';
  public load = false;
  public userLogged = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private utilities: UtilitiesService
  ) {
  }

  ngOnInit() {
    this.utilities.showLoadingSubject.subscribe(val => { this.load = val; });
    this.hasUserLogged();
  }

  private hasUserLogged(): void {
    const userLogged = this.userService.getUserLogged();
    if (!userLogged) {
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(): void {
    this.userService.removeCredentials();
  }

}
