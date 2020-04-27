import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpError } from '../interface/http-error';
import { PaymentType } from '../model/price/payment-type.model';
import { VirtualStore } from '../model/price/virtual-store.model';
import { Street } from '../model/price/street.model';
import { BranchGroup } from '../model/price/branch-group.model';
import { GroupSalesTable } from '../model/price/group-sales-table.model';

@Injectable()
export class PriceService {

    constructor(
        private http: HttpClient
    ) { }

    getStreet(): Observable<any> {
        return this.http.get<Array<Street>>(`${environment.apiUrlPrice}v1/street/`,
            {
                observe: 'response',
                headers: this.getHttpOptions()
            }).pipe(
                map(res => {
                    return res;
                }, err => {
                    console.log(err);
                }),
                catchError(
                    (error) => throwError(error || 'Server error')
                ));
    }

    getPaymentType(): Observable<any> {
        return this.http.get<Array<PaymentType>>(`${environment.apiUrlPrice}v1/payment-type`,
            {
                observe: 'response',
                headers: this.getHttpOptions()
            }).pipe(
                map(res => {
                    return res;
                }, err => {
                    console.log(err);
                }),
                catchError(
                    (error) => throwError(error || 'Server error')
                ));
    }

    getVirtualStore(): Observable<any> {
        return this.http.get<Array<VirtualStore>>(`${environment.apiUrlPrice}v1/virtual-store`,
            {
                observe: 'response',
                headers: this.getHttpOptions()
            }).pipe(
                map(res => {
                    return res;
                }, err => {
                    console.log(err);
                }),
                catchError(
                    (error) => throwError(error || 'Server error')
                ));
    }

    getBranchGroup(): Observable<any> {
        return this.http.get<Array<BranchGroup>>(`${environment.apiUrlPrice}v1/branch-group`,
            {
                observe: 'response',
                headers: this.getHttpOptions()
            }).pipe(
                map(res => {
                    return res;
                }, err => {
                    console.log(err);
                }),
                catchError(
                    (error) => throwError(error || 'Server error')
                ));
    }

    getGroupSalesTable(): Observable<any> {
        return this.http.get<Array<GroupSalesTable>>(`${environment.apiUrlPrice}v1/group-sales-table`,
            {
                observe: 'response',
                headers: this.getHttpOptions()
            }).pipe(
                map(res => {
                    return res;
                }, err => {
                    console.log(err);
                }),
                catchError(
                    (error) => throwError(error || 'Server error')
                ));
    }

    private getHttpOptions() {

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'checkout-api-version': 'v1',
        });

        return headers;
    }

}
