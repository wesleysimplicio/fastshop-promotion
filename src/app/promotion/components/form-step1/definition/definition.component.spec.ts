import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { DefinitionComponent } from './definition.component';
import { FormBuilder } from '@angular/forms';
import { UtilValidation } from 'src/app/shared/util/util.validation';

describe('DefinitionComponent', () => {
  let component: DefinitionComponent;
  let fixture: ComponentFixture<DefinitionComponent>;

  beforeEach(async(() => {
    const utilValidationStub = {
      validateAllFormFields: () => {}
    };
    const formBuilderStub: FormBuilder = new FormBuilder();
    
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ DefinitionComponent ],
      providers: [
        {provide: FormBuilder, useValue: formBuilderStub},
        { provide: UtilValidation, useValue: utilValidationStub }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
