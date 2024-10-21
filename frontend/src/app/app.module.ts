import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CdkMenuModule } from '@angular/cdk/menu';  // Assicurati di averlo importato



import { LoginComponent } from './components/login/login.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from './modules/material/material.module';
import { HttpClientModule } from '@angular/common/http';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { UserListComponent } from './components/user-list/user-list.component';
import { ProductListComponent } from './components/product/product-list/product-list.component';
import { CommonModule } from "@angular/common";
import { ProfiloComponent } from "./components/profile/profile.component";
import { ProductCreationComponent } from './components/product/product-creation/product-creation.component';
import { SingleProductComponent } from './components/product/single-product/single-product.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateOrderComponent } from './components/order/create-order/create-order.component';
import { UserInfoComponent } from './components/structure/user-info/user-info.component';
import { CartComponent } from './components/cart/cart.component';
import { OrdersComponent } from './components/order/orders/orders.component';
import { StatusIconHtmlPipe } from './pipes/status-icon-html.pipe';
import { ProductCardComponent } from './components/product/product-card/product-card.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { InventoryComponent } from './components/product/inventory/inventory.component';
import { DialogAlertComponent } from './components/dialogs/dialog-alert/dialog-alert.component';
import { OrderComponent } from './components/order/order.component';
import { ListOrderComponent } from './components/order/list-order/list-order.component';
import { OrderDetailsComponent } from './components/order/order-details/order-details.component';
import { LogoutComponent } from './components/logout/logout.component';
import { AdminDialogComponent } from './components/admin-dialog/admin-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import { OrderedProductComponent } from './components/product/ordered-product/ordered-product.component';
import { LoaderComponent } from './components/structure/loader/loader.component';
import { DialogStrutturaComponent } from './components/structure/dialog-struttura/dialog-struttura.component';
import { DialogConfermaComponent } from './components/structure/dialog-conferma/dialog-conferma.component';
import { DialogWarningsSuccessesComponent } from './components/structure/dialog-warnings-successes/dialog-warnings-successes.component';
import { FooterComponent } from './components/structure/footer/footer.component';
import {EditDescriptionDialogComponent} from "./components/structure/edit-description-dialog/edit-description-dialog.component";

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
    CreateOrderComponent,
    UserInfoComponent,
    CartComponent,
    OrdersComponent,
    StatusIconHtmlPipe,
    ProductCardComponent,
    UnauthorizedComponent,
    InventoryComponent,
    DialogAlertComponent,
    OrderComponent,
    ListOrderComponent,
    OrderDetailsComponent,
    LogoutComponent,
    OrderedProductComponent,
    LoaderComponent,
    AdminDialogComponent,
    DialogStrutturaComponent,
    DialogConfermaComponent,
    DialogWarningsSuccessesComponent,
    FooterComponent,
    EditDescriptionDialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatIconModule,
    CdkMenuModule,
    FontAwesomeModule,
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
  }
}
