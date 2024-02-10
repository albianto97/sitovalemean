import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {User} from "../../models/user";
import {OrderService} from "../../services/order.service";
import {Order} from "../../models/order";


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = []; // Qui puoi definire una classe interfaccia User se vuoi tipizzare i dati degli utenti
  displayedColumns: string[] = ['name', 'email', 'numero ordini'];
  orders: Order[] = [];

  constructor(private userService: UserService, private orderService: OrderService) { }

  ngOnInit(): void {
    // Chiamata al servizio per ottenere la lista degli utenti al caricamento del componente
    this.getUsers();
    this.getAllOrders();

  }

  getUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }
  getAllOrders(): void {
    this.orderService.getAllOrders().subscribe(orders => {
      this.orders = orders;
    });
  }


}

