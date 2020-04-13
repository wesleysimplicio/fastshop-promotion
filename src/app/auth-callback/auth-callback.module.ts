import { AuthCallbackRoutingModule } from './auth-callback-routing.module';
import { AuthCallbackComponent } from './auth-callback.component';
// import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AuthCallbackComponent
  ],
  imports: [
    CommonModule,
    // SharedModule,
    AuthCallbackRoutingModule
  ]
})
export class AuthCallbackModule { }
