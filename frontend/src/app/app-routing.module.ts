import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ReservationCartComponent } from './components/reservation-cart/reservation-cart.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { AdminProductFormComponent } from './components/admin-product-form/admin-product-form.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginRegisterComponent },
  { path: 'dashboard', component: ProductListComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: ReservationCartComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminPanelComponent, canActivate: [AdminGuard] },
  { path: 'admin/product/new', component: AdminProductFormComponent, canActivate: [AdminGuard] },
  { path: 'admin/product/:id/edit', component: AdminProductFormComponent, canActivate: [AdminGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
