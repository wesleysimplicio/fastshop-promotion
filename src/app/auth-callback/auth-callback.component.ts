import { AuthService } from './../shared/services/auth.service';
import { AuthGuardService } from './../shared/services/auth-guard.service';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.css']
})
export class AuthCallbackComponent implements OnInit {


  constructor(
    public service: AuthService
    ) { }

  ngOnInit() {
    this.service.completeAuthentication().then();
  }

}
