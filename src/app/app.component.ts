import { environment } from 'src/environments/environment';
import { Passport } from './shared/model/login/passport.model';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, OnChanges, SimpleChanges, AfterViewChecked } from '@angular/core';
import { UserService } from './shared/model/user/user.service';
import { UtilitiesService } from './shared/services/utilities.service';
import { PassportUserService } from './shared/services/passport-user-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewChecked {
  public title = 'FastShopPromotion';
  public load = false;
  public userLogged = false;
  passport: Passport;

  constructor(
    private userService: UserService,
    private utilities: UtilitiesService,
    private passportUserService: PassportUserService,
    private changeRef: ChangeDetectorRef
  ) {
  }

  ngAfterViewChecked(): void {
    this.changeRef.detectChanges();
  }

  ngOnInit() {
    this.passport = this.passportUserService.get();
    this.utilities.showLoadingSubject.subscribe(val => { this.load = val; });
    this.hasPassport();
  }



  private hasPassport(): void {
    if (!this.passport) {
      window.location.href = environment.login;
    }
  }

  ngOnDestroy(): void {
    this.userService.removeCredentials();
  }

}
