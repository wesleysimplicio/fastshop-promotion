import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormStep1Component } from './form-step1.component';

describe('FormStep1Component', () => {
  let component: FormStep1Component;
  let fixture: ComponentFixture<FormStep1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormStep1Component ]
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
