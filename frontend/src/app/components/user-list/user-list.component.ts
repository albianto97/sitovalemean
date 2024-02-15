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


  constructor(private userService: UserService, private orderService: OrderService) { }

  ngOnInit(): void {
    // Chiamata al servizio per ottenere la lista degli utenti al caricamento del componente
    this.getUsers();
    this.getAllOrders();

    // Inizializza gli utenti filtrati con tutti gli utenti all'inizio
    this.filteredUsers = this.users;
  }


  getAllOrders(): void {
    this.orderService.getAllOrders().subscribe(orders => {
      this.orders = orders;
    });
  }
  getUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      // Inizializza gli utenti filtrati con tutti gli utenti all'inizio
      this.filteredUsers = users;
    });
  }

  filterUsers(): void {
    if (!this.selectedUserName) {
      // Se viene selezionata l'opzione "Tutti", mostra tutti gli utenti
      this.filteredUsers = this.users;
    } else {
      // Altrimenti, filtra gli utenti in base al nome selezionato
      this.filteredUsers = this.users.filter(user => user.username === this.selectedUserName);
    }
  }


}

