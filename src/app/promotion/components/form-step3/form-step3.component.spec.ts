import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ComponentRef } from '@angular/core';

import { FormStep3Component } from './form-step3.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject, Observable } from 'rxjs';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { ToastrService, ToastRef, ToastrModule } from 'ngx-toastr';
import { UtilValidation } from 'src/app/shared/util/util.validation';
import { PromotionService } from '../../services/promotion.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/shared/model/user/user.service';
import { PriceService } from 'src/app/shared/services/price.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('FormStep3Component', () => {
  let component: FormStep3Component;
  let fixture: ComponentFixture<FormStep3Component>;

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
    const userServiceStub: Partial<UserService> = {
      getUserLoggedSubject: () => new Subject()
    };
    const priceServiceStub: Partial<PriceService> = {
      getStreet: () => of(),
      getVirtualStore: () => of(),
      getBranchGroup: () => of(),
      getGroupSalesTable: () => of(),
    };
    const utilValidationStub: Partial<UtilValidation> = {};
    const promotionStub: Partial<PromotionService> = {
      getPromotion: () => of([])
    };
    const toastrStub = jasmine.createSpyObj('ToastrService', ['warning']);

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [FormStep3Component],
      providers: [
        { provide: FormBuilder, useValue: formBuilderStub },
        { provide: UtilitiesService, useValue: utilitiesServiceStub },
        { provide: UtilValidation, useValue: utilValidationStub },
        { provide: PromotionService, useValue: promotionStub },
        { provide: UserService, useValue: userServiceStub },
        { provide: PriceService, useValue: priceServiceStub },
        { provide: ToastrService, useValue: toastrStub },
        { provide: Router, useValue: routerStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot()
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormStep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
