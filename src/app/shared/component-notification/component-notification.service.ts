import { ReplaySubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class ComponentNotification {

    private notification      = new ReplaySubject<any>(1);
    private activatePromotion = new ReplaySubject<any>(1);

    getNotification(): Observable<any> {
        return this.notification;
    }

    setNotification(data: any): void {
        this.notification.next(data);
    }

    getActivatePromotion(): Observable<any> {
        return this.activatePromotion;
    }

    setActivatePromotion(data: any): void {
        this.activatePromotion.next(data);
    }

}
