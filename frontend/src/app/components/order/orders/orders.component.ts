import { Component, Input, OnInit } from '@angular/core';

import { Order, Status } from "../../../models/order";
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})

export class OrdersComponent implements OnInit {
  ordersAll: Order[] = [];
  ordersFiltered: Order[] = [];
  orderToShow: Order[] = [];
  utentiEmail: any[] = [];
  utentiUsername: any[] = [];
  userIdSearch: string = "";
  idOrderToSearch = new FormControl('');
  options: string[] = [];
  filteredOptions: Observable<string[]> | undefined;
  selectedOrderStatus: string | undefined; // Valore predefinito del filtro
  // per gestire il paginator
  pageEvent: PageEvent | undefined;
  length = 50;
  pageSize = 9;
  pageIndex = 0;
  pageSizeOptions = [6, 9, 18, 27];

  constructor(private orderService: OrderService, private userService: UserService,
    public authService: AuthService, private _matSnackBar: MatSnackBar
  ) { }
  ngOnInit(): void {
    this.getOrders();

  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
  getOrders(): void {
    if (this.authService.isAdmin()) {
      this.orderService.getAllOrders().subscribe(orders => {
        this.ordersAll = orders;
        this.setOrderVariable();
        this.setUsers();
        this.filteredOptions = this.idOrderToSearch.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value || '')),
        );
      },
        error => {
          const message = 'Errore nel recupero degli ordini'
          this._matSnackBar.open(message, 'chiudi', {
            duration: 5 * 1000,
          });
          console.error('Error fetching data', error);
        }
      );
    } else {
      this.orderService.getOrdersFromUser().subscribe(orders => {
        this.ordersAll = orders;
        this.setOrderVariable();
        this.setUsers();
        this.filteredOptions = this.idOrderToSearch.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value || '')),
        );
      },
        error => {
          const message = 'Errore nel recupero degli ordini'
          this._matSnackBar.open(message, 'chiudi', {
            duration: 5 * 1000,
          });
          console.error('Error fetching data', error);
        }
      );
    }
  }
  setOrderVariable(isFiltered: boolean = false) {
    if (!isFiltered) {
      this.ordersFiltered = this.ordersAll;
    }
    else {
      this.ordersFiltered = this.ordersAll;

      if (this.userIdSearch != "") {
        this.ordersFiltered = this.ordersAll.filter(order => order.user === this.userIdSearch);
      }
      if (this.idOrderToSearch.value != "") {
        this.ordersFiltered = this.ordersAll.filter(order => order._id === this.idOrderToSearch.value);
      }
      if (this.selectedOrderStatus != "" && this.selectedOrderStatus != undefined) {
        this.ordersFiltered = this.ordersAll.filter(order => order.status === this.selectedOrderStatus)
      }
    }
    let elementi = this.pageSize


    if ((this.pageIndex + 1) * this.pageSize > this.ordersFiltered.length) {
      elementi = (this.ordersFiltered.length - this.pageIndex * this.pageSize)

    }
    console.log(elementi, this.pageIndex * this.pageSize, elementi);

    this.orderToShow = this.ordersFiltered.slice(this.pageIndex * this.pageSize, (this.pageIndex * this.pageSize) + elementi)

  }
  setUsers() {
    const uniqueUsers = Array.from(new Set(this.ordersAll.map(order => order.user)));
    const uniqueIds = Array.from(new Set(this.ordersAll.map(order => order._id)));
    if (uniqueIds != undefined) {
      const stringArray: string[] = uniqueIds.filter((value: string | undefined): value is string => value !== undefined);
      this.options = stringArray;
    }
    console.log(uniqueUsers);
    uniqueUsers.forEach(userId => {
      this.userService.getUserById(userId).subscribe(user => {
        this.utentiEmail.push({ key: userId, value: user.email });
        this.utentiUsername.push({ key: userId, value: user.username });
      });
    });
  }
  filterOrder() {
    console.log(this.userIdSearch, this.idOrderToSearch.value);
    this.pageIndex = 0;
    const isFIltered = this.userIdSearch != "" || this.idOrderToSearch.value != "" || this.selectedOrderStatus != "";
    this.setOrderVariable(isFIltered);

  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    const isFIltered = this.userIdSearch != "" || this.idOrderToSearch.value != "";
    this.setOrderVariable(isFIltered);

  }

  ripristina(): void {
    this.userIdSearch = '';  // Clear the user selection
    this.idOrderToSearch.reset();  // Clear the order ID field
  }

}
