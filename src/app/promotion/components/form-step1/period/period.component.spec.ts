import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { PeriodComponent } from './period.component';
import { FormBuilder } from '@angular/forms';
import { UtilValidation } from 'src/app/shared/util/util.validation';

describe('PeriodComponent', () => {
  let component: PeriodComponent;
  let fixture: ComponentFixture<PeriodComponent>;

  beforeEach(async(() => {
    const utilValidationStub = {
      validateAllFormFields: () => {}
    };
    const formBuilderStub: FormBuilder = new FormBuilder();

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ PeriodComponent ],
      providers: [
        {provide: FormBuilder, useValue: formBuilderStub},
        { provide: UtilValidation, useValue: utilValidationStub }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
