import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Promotion } from '../model/promotion.model';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpError } from '../../shared/interface/http-error';
import { Product } from '../model/product.model';


@Injectable()
export class PromotionService {

    constructor(
        private http: HttpClient
    ) { }

    updatePromotionPriceProduct(idPromotion, price, sku): Observable<any> {
        return this.http.patch(`${environment.apiUrl}v1/promotion/${idPromotion}/product/${sku}/fixed-price`,
            JSON.stringify({ fixedPrice: price }),
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

    updatePromotionStatus(idPromotion, statusPromotion): Observable<any> {
        return this.http.patch(`${environment.apiUrl}v1/promotion/${idPromotion}/status`,
            JSON.stringify({ status: statusPromotion }),
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

    getPromotion(idPromotion = ''): Observable<any> {
        return this.http.get<Array<Promotion>>(`${environment.apiUrl}v1/promotion/${idPromotion}`,
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

    getPromotionProducts(idPromotion = ''): Observable<any> {
        return this.http.get<Array<Product>>(`${environment.apiUrl}v1/promotion/${idPromotion}/products`,
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

    addUpdatePromotion(promotion: Promotion): Observable<any> {
        let send;
        if (promotion.id) {
            send = this.http.put<Promotion>(`${environment.apiUrl}v1/promotion`,
                JSON.stringify(promotion),
                {
                    observe: 'response',
                    headers: this.getHttpOptions()
                });
        } else {
            send = this.http.post<Promotion>(`${environment.apiUrl}v1/promotion`,
                JSON.stringify(promotion),
                {
                    observe: 'response',
                    headers: this.getHttpOptions()
                });
        }

        return send.pipe(
            map(res => {
                return res;
            }, err => {
                console.log(err);
            }),
            catchError(
                (error) => throwError(error || 'Server error')
            ));
    }

    addPromotionProduct(idPromotion, data): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('file', data, 'arquivo.csv');
        return this.http.post<Boolean>(`${environment.apiUrl}v1/promotion/${idPromotion}/products`, formData);
    }


    private getHttpOptions() {

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'checkout-api-version': 'v1',
        });

        return headers;
    }

}
