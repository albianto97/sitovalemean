import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from './modules/material/material.module';

import { HttpClientModule } from  '@angular/common/http';
import { UserListComponent } from './components/profile/user-list/user-list.component';
import { ProductListComponent } from './components/product/product-list/product-list.component';
import {CommonModule} from "@angular/common";
import {ProfiloComponent} from "./components/profile/profile.component";
import { ProductCreationComponent } from './components/product/product-creation/product-creation.component';
import { SingleProductComponent } from './components/product/single-product/single-product.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateOrderComponent } from './components/order/create-order/create-order.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignInComponent,
    UserListComponent,
    ProductListComponent,
    ProfiloComponent,
    ProductCreationComponent,
    SingleProductComponent,
    CreateOrderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatIconModule,
    HttpClientModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
