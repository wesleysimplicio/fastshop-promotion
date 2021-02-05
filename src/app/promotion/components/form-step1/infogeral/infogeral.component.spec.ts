import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { InfogeralComponent } from './infogeral.component';
import { FormBuilder } from '@angular/forms';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { UtilValidation } from 'src/app/shared/util/util.validation';

describe('InfogeralComponent', () => {
  let component: InfogeralComponent;
  let fixture: ComponentFixture<InfogeralComponent>;

  beforeEach(async(() => {
    const utilValidationStub = {
      validateAllFormFields: () => {}
    };
    const formBuilderStub: FormBuilder = new FormBuilder();

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ InfogeralComponent ],
      providers: [
        {provide: FormBuilder, useValue: formBuilderStub},
        { provide: UtilValidation, useValue: utilValidationStub }

      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfogeralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy(); 
  });

  it('method strChanges', () => {
    component.typePromo = 'coupon';
    component.strChanges();
    expect(component.strPromo).toEqual('Cupom');
  });

  it('method isFormsValid', () => {
    component.isFormsValid();
    expect(component).toBeTruthy();
  });

  it('method toggleInfoGeral', () => {
    component.toggleInfoGeral();
    expect(component).toBeTruthy();
  });
});
