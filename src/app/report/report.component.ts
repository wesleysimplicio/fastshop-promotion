import { Report } from './../shared/model/report/report.model';
import { ReportService } from './report-service/report.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IBreadcrumb } from './../shared/interface/breadcrumb';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UtilitiesService } from './../shared/services/utilities.service';

import * as moment from 'moment';
import * as fileSaver from 'file-saver';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, OnDestroy {

  breadcrumbs = new Array<IBreadcrumb>();
  submitted = false;
  reportForm: FormGroup;
  startDate: boolean;
  endDate: boolean;
  today: Date;
  startAt;
  endAt;
  downloadError = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService,
    private utilities: UtilitiesService
  ) { }


  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    this.initBreadcrumbs();
    this.initForm();
    this.listeningDates();
    this.today = new Date();
  }

  private initBreadcrumbs(): void {
    this.breadcrumbs.push(
      {
        url: '/report',
        label: 'Relatórios'
      }
    );
  }

  listeningDates() {
    this.reportForm.get('startAt').valueChanges.subscribe(res => {
      if (res && res.length === 8) {
        this.dateStartIsValid(res);
      }
    });
    this.reportForm.get('endAt').valueChanges.subscribe(res => {
      if (res && res.length === 8) {
        this.endAt = this.buildDate(res);
        this.dateEndtIsValid(res);
      }
    });
  }

  getReport(): void {
    this.submitted = true;

    if (this.reportForm.invalid || this.startDate || this.endDate) {
      return;
    }

    this.utilities.showLoading(true);

    let subscription = this.reportService.getReport(this.configGetRequest()).subscribe(res => {
      this.saveFile(res.body, 'Relatório');
      this.resetForm();
    }, async (error) => {
      this.downloadError = true;
      this.utilities.showLoading(false);
    });
    
    this.subscriptions.push(subscription);
  }

  closeAlert(): void {
    this.downloadError = false;
  }

  private configGetRequest(): Report {
    const report = new Report();
    report.startAt = moment(this.reportForm.get('startAt').value, 'DDMMYYYYHHmm').format('YYYY-MM-DDTHH:mm:ss');
    report.endAt = moment(this.reportForm.get('endAt').value, 'DDMMYYYYHHmm').set('hour', 23).set('minute', 59).set('seconds', 59).format('YYYY-MM-DDTHH:mm:ss');
    report.couponCode = this.reportForm.get('couponCode').value;
    return report;
  }

  private buildDate(date: string): Date {
    let dia;
    let mes;
    let ano;
    dia = parseInt(date.substring(0, 2), 10);
    mes = parseInt(date.substring(2, 4), 10);
    ano = parseInt(date.substring(4), 10);
    return new Date(ano, (mes - 1), dia);
  }

  private invalidDate(date: string): boolean {
    let dia;
    let mes;
    dia = parseInt(date.substring(0, 2), 10);
    mes = parseInt(date.substring(2, 4), 10);
    return dia > 31 || mes > 12;
  }

  private dateStartIsValid(date: string): void {
    if (this.invalidDate(date)) {
      this.startDate = true;
    } else {
      this.startDate = false;
      this.startAt = this.buildDate(date);
    }
  }

  private dateEndtIsValid(date: string): void {
    if (this.invalidDate(date)) {
      this.endDate = true;
    } else {
      this.endDate = false;
      this.endAt = this.buildDate(date);
    }
  }

  private initForm(): void {
    this.reportForm = this.fb.group({
      startAt: ['', Validators.required],
      endAt: ['', Validators.required],
      couponCode: [null]
    });
  }

  private saveFile(data: any, filename?: string) {
    const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
    fileSaver.saveAs(blob, filename + '.xlsx');
  }

  private resetForm(): void {
    this.reportForm.reset();
    this.utilities.showLoading(false);
    this.downloadError = false;
    this.submitted = false;
  }
}
