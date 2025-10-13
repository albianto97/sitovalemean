import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Componenti importati
import { HomeComponent } from './pages/home/home.component';
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ReservationCartComponent } from './components/reservation-cart/reservation-cart.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { AdminProductFormComponent } from './components/admin-product-form/admin-product-form.component';

// 🌐 Definizione delle rotte principali
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginRegisterComponent },
  { path: 'dashboard', component: ProductListComponent },
  { path: 'cart', component: ReservationCartComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'admin', component: AdminPanelComponent },
  { path: 'admin/product/new', component: AdminProductFormComponent },
  { path: 'admin/product/:id/edit', component: AdminProductFormComponent },
  { path: '**', redirectTo: '' } // Redirect per percorsi non trovati
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
