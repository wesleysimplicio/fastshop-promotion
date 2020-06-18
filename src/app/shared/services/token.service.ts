import { Injectable } from '@angular/core';

const KEY = 'token';

@Injectable({providedIn: 'root'})
export class TokenService {

  hasToken(): boolean {
    return !!this.getToken();
  }

  setToken(token: string): void {
    window.localStorage.setItem(KEY, token);
  }

  getToken() {
    return window.localStorage.getItem(KEY);
  }

  removeToken() {
    window.localStorage.removeItem(KEY);
  }

}
