import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ListingComponent } from './listing.component';
import { FormBuilder } from '@angular/forms';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { PromotionService } from '../../services/promotion.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ListingComponent', () => {
  let component: ListingComponent;
  let fixture: ComponentFixture<ListingComponent>;
  const formBuilderStub: FormBuilder = new FormBuilder();


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
      params: of({typePromo: 'coupon'})
    };
    const utilitiesServiceStub: Partial<UtilitiesService> = {
      showLoading: () => of()
    };
    const toastrStub: Partial<ToastrService> = {};
    const promotionStub: Partial<PromotionService> = {
      getPromotion: () => of([])
    };

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ListingComponent],
      providers: [
        { provide: FormBuilder, useValue: formBuilderStub },
        { provide: UtilitiesService, useValue: utilitiesServiceStub },
        { provide: PromotionService, useValue: promotionStub },
        { provide: ToastrService, useValue: toastrStub },
        { provide: Router, useValue: routerStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
