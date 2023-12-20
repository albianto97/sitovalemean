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
  {path : '', component: LoginComponent},
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


// TODO: creazione prodotto fatta, bisogna gestire in maniera diversa il 400/404?
// TODO: branch Ordine --> creazione ordine, rotte per accettazione e rifiuto fatte (da testare)
