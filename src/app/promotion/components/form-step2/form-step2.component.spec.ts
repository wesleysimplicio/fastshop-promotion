import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { FormStep2Component } from './form-step2.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { UtilValidation } from 'src/app/shared/util/util.validation';
import { PromotionService } from '../../services/promotion.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/shared/model/user/user.service';
import { PriceService } from 'src/app/shared/services/price.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Promotion } from '../../model/promotion.model';

describe('FormStep2Component', () => {
  let component: FormStep2Component;
  let fixture: ComponentFixture<FormStep2Component>;

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
    const toastrStub = jasmine.createSpyObj('ToastrService', ['warning']);
    const userServiceStub: Partial<UserService> = {
      getUserLoggedSubject: () => new Subject()
    };
     const priceServiceStub: Partial<PriceService> = {
      getPaymentType: () => of(),
    };;
    const utilValidationStub: Partial<UtilValidation> = {};
    const promotionStub: Partial<PromotionService> = {
      getPromotion: () => of([])
    };
    
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ FormStep2Component ],
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
        HttpClientTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot()
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // component.promotion = new Promotion();
    // component.typePromo = 'open';
    expect(component).toBeTruthy();
  });
});
