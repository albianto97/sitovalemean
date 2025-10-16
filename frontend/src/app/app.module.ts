import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ReservationCartComponent } from './components/reservation-cart/reservation-cart.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { AdminProductFormComponent } from './components/admin-product-form/admin-product-form.component';
import {TokenInterceptor} from "./core/interceptors/token.interceptor";
import {ResetPasswordComponent} from './components/reset-password/reset-password.component';
import {ForgotPasswordComponent} from './components/forgot-password/forgot-password.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginRegisterComponent,
    ProductListComponent,
    ReservationCartComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    UserProfileComponent,
    AdminPanelComponent,
    AdminProductFormComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
