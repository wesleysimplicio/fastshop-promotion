import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { HeadersComponent } from './headers.component';
import { Router } from '@angular/router';
import { UserService } from '../../model/user/user.service';
import { Subject } from 'rxjs';
import { AuthService } from '../../services/auth.service';

describe('HeadersComponent', () => {
  let component: HeadersComponent;
  let fixture: ComponentFixture<HeadersComponent>;

  beforeEach(async(() => {
    const routerStub = { navigate: () => ({}) };
    const userServiceStub: Partial<UserService> = {
      getUserLoggedSubject: () => new Subject()
    };
    const authServiceStub: Partial<AuthService> = {
      // getUserLoggedSubject: () => new Subject()
    };

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ HeadersComponent ],
      providers: [
        { provide: Router, useValue: routerStub },
        { provide: UserService, useValue: userServiceStub },
        { provide: AuthService, useValue: authServiceStub },

      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
