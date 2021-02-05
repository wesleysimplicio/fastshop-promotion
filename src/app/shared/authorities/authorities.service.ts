import { Injectable } from '@angular/core';
import { Authorities } from '../model/authorities/authorities.model';

const KEY = 'authorities';

@Injectable({
  providedIn: 'root'
})
export class AuthoritiesService {

  setAuthorities(authorities: Authorities): void {
    window.localStorage.setItem(KEY, JSON.stringify(authorities));
  }

  getAuthorities() {
    return JSON.parse(window.localStorage.getItem(KEY));
  }

  removeAuthorities(): void {
    window.localStorage.removeItem(KEY);
  }
}
