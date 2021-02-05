import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { FormStep1Component } from './form-step1.component';
import { FormBuilder } from '@angular/forms';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { ToastrService } from 'ngx-toastr';
import { PromotionService } from '../../services/promotion.service';
import { of, Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilValidation } from 'src/app/shared/util/util.validation';
import { UserService } from 'src/app/shared/model/user/user.service';

describe('FormStep1Component', () => {
  let component: FormStep1Component;
  let fixture: ComponentFixture<FormStep1Component>;

  beforeEach(async(() => {
    const formBuilderStub: FormBuilder = new FormBuilder();
    const routerStub = { navigate: () => ({}) };
    const activatedRouteStub = {
      snapshot: {
        params: of({
          typePromo: 'coupon',
          id: 'asdasdasdasd'
        })
      },
      params: of({ typePromo: 'coupon' })
    };
    const utilitiesServiceStub: Partial<UtilitiesService> = {
      showLoading: () => of()
    };
    const toastrStub: Partial<ToastrService> = {};
    const userServiceStub: Partial<UserService> = {
      getUserLoggedSubject: () => new Subject()
    };    const utilValidationStub: Partial<UtilValidation> = {};
    const promotionStub: Partial<PromotionService> = {
      getPromotion: () => of([])
    };

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [FormStep1Component],
      providers: [
        { provide: FormBuilder, useValue: formBuilderStub },
        { provide: UtilitiesService, useValue: utilitiesServiceStub },
        { provide: UtilValidation, useValue: utilValidationStub },
        { provide: PromotionService, useValue: promotionStub },
        { provide: UserService, useValue: userServiceStub },
        { provide: ToastrService, useValue: toastrStub },
        { provide: Router, useValue: routerStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
