import { Injectable } from '@angular/core';

import { UserManager, UserManagerSettings, User } from 'oidc-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private manager = new UserManager(getClientSettings());
  private user: User = null;
  private isAuthenticatedSubject = new BehaviorSubject<any>(false);
  private isAuthenticatedListener: Observable<any>;
  private restrictEmails = ['bianca@fastshop.com.br', 'renato@fastshop.com.br', 'alex@fastshop.com.br'];


  constructor() {
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(JSON.parse(sessionStorage.getItem('oidc.user:https://dev-auth.kaive.com.br/:portal-multiplecar')));
    this.isAuthenticatedListener = this.isAuthenticatedSubject.asObservable();
    this.manager.getUser().then(user => {
      this.user = user;
    });
  }

  public currentUser():Observable<any>{
    return this.isAuthenticatedListener;
  }

  public get currentUserValue(): any {
    return this.isAuthenticatedSubject.value;
  }

  isLoggedIn(): boolean {
    // if (this.currentUserValue && this.currentUserValue.access_token != null) {
    //   return true;
    // }
    //linhas comentadas
    return true;
  }



  getClaims(): any {
    return this.user.profile;
  }

  getAuthorizationHeaderValue(): string {
    return `${this.user.token_type} ${this.user.access_token}`;
  }

  completeAuthentication(): Promise<void> {
    return this.manager.signinRedirectCallback().then(user => {
      this.user = user;
      this.isAuthenticatedSubject.next(user);
    });
  }

  login(): Promise<void> {
    return this.manager.signinRedirect().then();
  }

  logout(): Promise<any>{
    return this.manager.signoutRedirect().then(() => this.isAuthenticatedSubject.next(null));
  }

  retrictEmail(email: string): boolean {
    return this.restrictEmails.some(e => e === email);
  }
}

export function getClientSettings(): UserManagerSettings {
  return {
    authority: 'https://dev-auth.kaive.com.br/',
    client_id: 'portal-multiplecar',
    redirect_uri: `${environment.callBack}`,
    post_logout_redirect_uri: `${environment.logout}`,
    response_type:"id_token token",
    scope:"openid profile mc.payment mc.price",
    filterProtocolClaims: true,
    loadUserInfo: true
  };
}
