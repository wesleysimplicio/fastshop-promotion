import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSelectionComponent } from './modal-selection.component';

describe('ModalComponent', () => {
  let component: ModalSelectionComponent;
  let fixture: ComponentFixture<ModalSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
