import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfogeralComponent } from './infogeral.component';

describe('InfogeralComponent', () => {
  let component: InfogeralComponent;
  let fixture: ComponentFixture<InfogeralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfogeralComponent ]
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
});
