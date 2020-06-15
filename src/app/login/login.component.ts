import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {

    // if (sessionStorage.getItem(`oidc.user:${environment.urlFastChannel}/:${environment.clientFastChannel}`)) {
    //   this.service.completeAuthentication().then();
    //   this.router.navigate(['/promotion']);
    // } else {
    //   this.service.login();
    // }

  }

  // goToTagPrice() {
  //   const token: any = JSON.parse(sessionStorage.getItem(`oidc.user:${environment.urlFastChannel}/:${environment.urlFastChannel}`));

  //   console.log(token.profile.preferred_username.substr(0, token.profile.preferred_username.indexOf('@')));

  //   this.router.navigate(['/promotion']);
  // }

  // goToPSV() {
  //   this.router.navigate(['precos-venda']);
  // }

}
