import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormOpenProductsComponent } from './form-open-products.component';

describe('FormOpenProductsComponent', () => {
  let component: FormOpenProductsComponent;
  let fixture: ComponentFixture<FormOpenProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormOpenProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormOpenProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
