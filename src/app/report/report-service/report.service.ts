import { Report } from './../../shared/model/report/report.model';
import { environment } from './../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class ReportService {

  constructor(
       private http: HttpClient
    ) {}

    getReport(report: Report): Observable<any> {
        const headers = new HttpHeaders();
        return this.http.get(this.getUrl(report), {
            headers,
            observe: 'response',
            responseType: 'blob'
          });
    }

    private getUrl(report: Report): string {
        if (!report.couponCode) {
            return environment.apiUrl + 'v1/promotion/coupon-order/report/download?startAt=' + report.startAt + '&endAt=' + report.endAt;
        }
        return environment.apiUrl + 'v1/promotion/coupon-order/report/download?startAt=' + report.startAt + '&endAt=' + report.endAt + '&couponCode=' + report.couponCode;
    }
}
