import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UtilitiesService } from './shared/services/utilities.service';
import { UserService } from './shared/model/user/user.service';
import { Router } from '@angular/router';
import { of, Subject } from 'rxjs';

xdescribe('AppComponent', () => {
  beforeEach(async(() => {
    const utilitiesServiceStub: Partial<UtilitiesService> = {
      showLoading: () => of()
    };
    const userServiceStub: Partial<UserService> = {
      getUserLoggedSubject: () => new Subject()
    };
    const routerStub = { navigate: () => ({}) };

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: UtilitiesService, useValue: utilitiesServiceStub },
        { provide: UserService, useValue: userServiceStub },
        { provide: Router, useValue: routerStub },
      ], imports: [
        HttpClientTestingModule,
        RouterTestingModule,
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'FastShopPromotion'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('FastShopPromotion');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('FastShopPromotion app is running!');
  });
});
