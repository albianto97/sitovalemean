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
  displayedColumns: string[] = ['name', 'email'];
  orders: Order[] = []; //ordini del cliente
  selectedUserName: string = ''; // Variabile per memorizzare il nome utente selezionato
  filteredUsers: User[] = []; // Variabile per memorizzare gli utenti filtrati, inizializzata con tutti gli utenti all'inizio

  selectedOrderStatus: string = ''; // Variabile per memorizzare lo stato dell'ordine selezionato
  filteredOrders: Order[] = []; //array ordini filtrati in base a orderStatus


  constructor(private userService: UserService, private orderService: OrderService) {
  }

  ngOnInit(): void {
    // Chiamata al servizio per ottenere la lista degli utenti al caricamento del componente
    this.getUsers();
    this.getOrders();

    // Inizializza gli utenti filtrati con tutti gli utenti all'inizio
    this.filteredUsers = this.users;
    this.filteredOrders = this.orders;
  }

  displayFn(user: User): string {
    return user && user.username ? user.username : '';
  }

  getOrders(): void {
      this.orderService.getAllOrders().subscribe(orders => {
        this.orders = orders;
        this.filteredOrders = orders;
      });
  }

  getUsers(): void {
      this.userService.getUsers().subscribe(users => {
        this.users = users;
        this.filteredUsers = users;
      });
  }

  filterData(): void {

    this.userService.searchUsers(this.selectedUserName).subscribe(users => {
      this.users = users;
      console.log(users);
    });

    this.orderService.searchOrderByUsername(this.selectedUserName, this.selectedOrderStatus).subscribe(orders => {
      this.filteredOrders = orders;
      console.log(this.filteredOrders);
    });

  }
}

