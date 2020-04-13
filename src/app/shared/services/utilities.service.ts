import { Injectable } from '@angular/core';
import { throwError, Observable, Subject } from 'rxjs';

@Injectable()
export class UtilitiesService {

  public isLoggedSubject = new Subject<boolean>();
  public userLoggedSubject = new Subject<any>();
  public showLoadingSubject = new Subject<boolean>();

  constructor() { }

  setLogged(value) {
    this.isLoggedSubject.next(value);
  }

  setUserLogged() {
    this.userLoggedSubject.next();
  }

  showLoading(value, scroll = false) {
    if (scroll) {
      window.scrollTo(0, 0);
    }
    this.showLoadingSubject.next(value);
  }

}
