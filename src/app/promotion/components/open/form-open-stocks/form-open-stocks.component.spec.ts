import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormOpenStocksComponent } from './form-open-stocks.component';

describe('FormOpenStocksComponent', () => {
  let component: FormOpenStocksComponent;
  let fixture: ComponentFixture<FormOpenStocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormOpenStocksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormOpenStocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
