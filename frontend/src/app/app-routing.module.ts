import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'

import {LoginComponent} from "./components/login/login.component";
import {SignInComponent} from "./components/sign-in/sign-in.component";
import {UserListComponent} from "./components/profile/user-list/user-list.component";
import {ProductListComponent} from "./components/product/product-list/product-list.component";
import {ProfiloComponent} from "./components/profile/profile.component";
import {ProductCreationComponent} from "./components/product/product-creation/product-creation.component";
import {SingleProductComponent} from "./components/product/single-product/single-product.component";
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
  {path : '', component: HomeComponent, canActivate: [AuthGuard]},
  {path : 'login', component: LoginComponent},
  {path : 'sign-in', component: SignInComponent},
  {path : 'userList', component: UserListComponent},
  {path : 'productList', component: ProductListComponent},
  {path : 'single', component: ProfiloComponent},
  { path: 'single-product/:productId', component: SingleProductComponent },
  {path : 'create-product', component: ProductCreationComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

