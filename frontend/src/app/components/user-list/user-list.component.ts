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
  filteredOrders: Order[] = [];

  constructor(private userService: UserService, private orderService: OrderService) { }

  ngOnInit(): void {
    // Chiamata al servizio per ottenere la lista degli utenti al caricamento del componente
    this.getUsers();
    this.getOrders();

    // Inizializza gli utenti filtrati con tutti gli utenti all'inizio
    this.filteredUsers = this.users;
  }


  getOrders(): void {
    if (!this.selectedOrderStatus) {
      this.orderService.getAllOrders().subscribe(orders => {
        this.orders = orders;
      });
    }else{
      console.log("ciao ordini");
    }
  }
  getUsers(): void {
    if (!this.selectedUserName) {
      this.userService.getUsers().subscribe(users => {
        this.users = users;
        // Inizializza gli utenti filtrati con tutti gli utenti all'inizio
        this.filteredUsers = users;
      });
    }else{
      /*this.orderService.getOrdersFromUser(this.selectedUserName).subscribe(orders => {
        this.orders = orders;
      });*/
      console.log("ciao utenti");
    }
  }

  filterData(): void {
    if (!this.selectedUserName && !this.selectedOrderStatus) {
      // Se non viene selezionato né un nome utente né uno stato dell'ordine, mostra tutti gli utenti e tutti gli ordini
      this.filteredUsers = this.users;
      this.filteredOrders = this.orders;
    } else {
      // Se è selezionato un nome utente, filtra gli utenti in base al nome
      if (this.selectedUserName) {
        this.filteredUsers = this.users.filter(user => user.username === this.selectedUserName);
      } else {
        this.filteredUsers = this.users;
      }

      // Se è selezionato uno stato dell'ordine, filtra gli ordini in base allo stato
      if (this.selectedOrderStatus) {
        this.filteredOrders = this.orders.filter(order => order.status === this.selectedOrderStatus);
      } else {
        this.filteredOrders = this.orders;
      }
    }
    this.getOrders(); this.getUsers();
  }
}

