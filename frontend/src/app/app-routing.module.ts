import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'

import { LoginComponent } from "./components/login/login.component";
import { SignInComponent } from "./components/sign-in/sign-in.component";
import { UserListComponent } from "./components/user-list/user-list.component";
import { ProfiloComponent } from "./components/profile/profile.component";
import { ProductCreationComponent } from "./components/product/product-creation/product-creation.component";
import { SingleProductComponent } from "./components/product/single-product/single-product.component";
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { CartComponent } from './components/cart/cart.component';
import { CreateOrderComponent } from './components/order/create-order/create-order.component';
import { OrdersComponent } from './components/order/orders/orders.component';
import {UnauthorizedComponent} from "./components/unauthorized/unauthorized.component";
import { InventoryComponent } from './components/product/inventory/inventory.component';
import { AdministratorGuard } from './guards/administrator.guard';
import {NonAdministratorGuard} from "./guards/non-administrator.guard";
import { OrderDetailsComponent } from './components/order/order-details/order-details.component';
import { StatisticsDashboardComponent } from './components/statistics-dashboard/statistics-dashboard.component';
import { IngredientsComponent } from './components/stock/ingredients/ingredients.component';
import { StockListComponent } from './components/stock/stock-list/stock-list.component';


const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'view-cart', component: CartComponent},
  { path: 'ingredients', component: IngredientsComponent, canActivate: [ AdministratorGuard]},
  { path: 'orders-ingredients', component: StockListComponent, canActivate: [ AdministratorGuard]},
  { path: 'order', component: CreateOrderComponent, canActivate: [AuthGuard, NonAdministratorGuard] },
  { path: 'orders', component: OrdersComponent, canActivate: [ AdministratorGuard] },
  { path: 'statistics', component: StatisticsDashboardComponent, canActivate: [ AdministratorGuard] },
  { path: 'userList', component: UserListComponent, canActivate: [ AdministratorGuard]},
  { path: 'orders/:orderId', component: OrderDetailsComponent, canActivate: [AuthGuard]},
  { path: 'productList', component: InventoryComponent },
  { path: 'profilo', component: ProfiloComponent, canActivate: [AuthGuard, NonAdministratorGuard] },  
  { path: 'order/detail', component: OrderDetailsComponent },
  { path: 'single-product/:productId', component: SingleProductComponent },
  { path: 'create-product', component: ProductCreationComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  // Assicurati di inserire questa rotta prima della wildcard (se presente)
  { path: '**', redirectTo: '/unauthorized' } // Reindirizza tutte le altre rotte non trovate alla pagina di errore "unauthorized"
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

