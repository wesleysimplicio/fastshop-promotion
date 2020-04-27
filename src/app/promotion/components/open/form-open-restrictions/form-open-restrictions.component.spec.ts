import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormOpenRestrictionsComponent } from './form-open-restrictions.component';

describe('FormOpenRestrictionsComponent', () => {
  let component: FormOpenRestrictionsComponent;
  let fixture: ComponentFixture<FormOpenRestrictionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormOpenRestrictionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormOpenRestrictionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
