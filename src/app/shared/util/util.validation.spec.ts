import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { CommonModule } from '@angular/common';
import { UtilValidation } from './util.validation';
import { ToastrService, ActiveToast } from 'ngx-toastr';

describe('UtilValidation', () => {
  let component: UtilValidation;
  let fixture: ComponentFixture<UtilValidation>;
  let toastrServiceStub: Partial<ToastrService>;
  let ActiveToast: ActiveToast<any> = null;
  beforeEach(async(() => {
    toastrServiceStub = {
      warning: () => ActiveToast,
    };
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        HttpClientTestingModule,
        BrowserDynamicTestingModule,
        CommonModule,
      ],
      providers: [
        { provide: ToastrService, useValue: toastrServiceStub },

      ],
      declarations: [UtilValidation]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtilValidation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
