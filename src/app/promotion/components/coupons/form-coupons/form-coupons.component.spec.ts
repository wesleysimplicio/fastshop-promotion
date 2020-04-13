import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCouponsComponent } from './form-coupons.component';

describe('FormCouponsComponent', () => {
  let component: FormCouponsComponent;
  let fixture: ComponentFixture<FormCouponsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCouponsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCouponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
