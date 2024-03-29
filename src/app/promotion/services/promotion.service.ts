import { Authorities } from './../../shared/model/authorities/authorities.model';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Promotion } from '../model/promotion.model';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpError } from '../../shared/interface/http-error';
import { Product } from '../model/product.model';
import { TokenService } from 'src/app/shared/services/token.service';

@Injectable()
export class PromotionService {

    token: string;
    constructor(
        private http: HttpClient,
        private tokenService: TokenService
    ) {
        this.token = this.tokenService.getToken();
    }

    updatePromotionPriceProduct(idPromotion, price, sku): Observable<any> {
        return this.http.patch(`${environment.apiUrl}v1/promotion/${idPromotion}/product/${sku}/fixed-price`,
            JSON.stringify({ discountValue: price }),
            {
                observe: 'response',
                headers: this.getHttpOptions()
            }).pipe(
                map(res => {
                    return res;
                }, err => {
                    console.error(err);
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
                    console.error(err);
                }),
                catchError(
                    (error) => throwError(error || 'Server error')
                ));
    }

    getPromotion(idPromotion = '', typePromo = 'open'): Observable<any> {
        return this.http.get<Array<Promotion>>(`${environment.apiUrl}v1/promotion/${idPromotion}?promotionType=` + typePromo.toLocaleUpperCase(),
            {
                observe: 'response',
                headers: this.getHttpOptions()
            }).pipe(
                map(res => {
                    return res;
                }, err => {
                    console.error(err);
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
                    console.error(err);
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
                console.error(err);
            }),
            catchError(
                (error) => throwError(error || 'Server error')
            ));
    }

    addPromotionProduct(idPromotion, data): Promise<Observable<any>> {
        const formData: FormData = new FormData();
        formData.append('file', data, 'arquivo.csv');
        return this.http.post<Boolean>(`${environment.apiUrl}v1/promotion/${idPromotion}/products`, formData, { headers: this.getHttpOptionsOnlyToken() }).toPromise<any>();
    }

    activateAllProducts(promotion: Promotion): Observable<Promotion> {
        return this.http.put<Promotion>(`${environment.apiUrl}v1/promotion/activateAllProducts`, promotion, { headers: this.getHttpOptionsOnlyToken() });
    }


    private getHttpOptions() {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        });

        return headers;
    }

    private getHttpOptionsOnlyToken() {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.token}`
        });

        return headers;
    }

    getAuthorities(): Observable<any> {
        return this.http.get<Authorities[]>(`${environment.apiUrl}v1/promotion/general-parameter/findAuthorities`,
            {
                observe: 'response',
                headers: this.getHttpOptions()
            })
            .pipe(
                map(res => {
                    return res;
                }, err => {
                    console.error(err);
                }),
                catchError(
                    (error) => throwError(error || 'Server error')
                ));
    }

    downloadFiles(id): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append('Accept', 'application/vnd.ms-excel; encoding=utf-8');
        return this.http.get(`${environment.apiUrl}v1/promotion/${id}/products/download`, {
            headers,
            observe: 'response',
            responseType: 'blob'
          });
    }

}
