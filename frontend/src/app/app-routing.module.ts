import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'

import {LoginComponent} from "./components/login/login.component";
import {SignInComponent} from "./components/sign-in/sign-in.component";
import {UserListComponent} from "./components/user-list/user-list.component";
import {ProductListComponent} from "./components/product-list/product-list.component";
import {ProfiloComponent} from "./components/profile/profile.component";
import {ProductCreationComponent} from "./components/product-creation/product-creation.component";
import {SingleProductComponent} from "./components/single-product/single-product.component";

const routes: Routes = [
  {path : 'login', component: LoginComponent},
  {path : 'signin', component: SignInComponent},
  {path : 'userList', component: UserListComponent},
  {path : 'productList', component: ProductListComponent},
  {path : 'single', component: ProfiloComponent},
  {path : 'create-product', component: ProductCreationComponent},
  { path: 'single-product/:productId', component: SingleProductComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


// TODO: CRITTOGRAFARE PASSWORD;
// TODO: SignIn controllo che non sia già presente nome ed email;  // testare --> errore in console se giusto?
// TODO: Profile --> branch creato per singola persona --> con stato mettere la persona che ha fatto login;
// TODO: creazione prodotto fatta, bisogna gestire in maniera diversa il 400/404?
