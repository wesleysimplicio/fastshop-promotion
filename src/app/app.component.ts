import { Component, OnInit, OnDestroy } from '@angular/core';
import { UtilitiesService } from './shared/services/utilities.service';
import { UserService } from './shared/model/user/user.service';
import { environment } from 'src/environments/environment';

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
    private utilities: UtilitiesService,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.utilities.showLoadingSubject.subscribe(val => { this.load = val; });
    this.isLogged();
  }

  ngOnDestroy(): void {
    this.userService.removeCredentials();
  }

  private isLogged(): void {
    this.userLogged = this.userService.isLogged();
  }

}
