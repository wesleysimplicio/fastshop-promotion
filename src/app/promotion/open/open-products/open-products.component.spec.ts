import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenProductsComponent } from './open-products.component';

describe('OpenProductsComponent', () => {
  let component: OpenProductsComponent;
  let fixture: ComponentFixture<OpenProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
