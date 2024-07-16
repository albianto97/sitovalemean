import { Component, OnInit } from '@angular/core';
import { UserService } from "../../services/user.service";
import { User } from "../../models/user";
import { OrderService } from "../../services/order.service";
import { Order } from "../../models/order";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = []; // Array per memorizzare la lista degli utenti
  displayedColumns: string[] = ['name', 'email'];
  orders: Order[] = []; // Array per memorizzare gli ordini del cliente
  selectedUserName: string = ''; // Variabile per memorizzare il nome utente selezionato
  filteredUsers: User[] = []; // Array per memorizzare gli utenti filtrati
  selectedOrderStatus: string = ''; // Variabile per memorizzare lo stato dell'ordine selezionato
  filteredOrders: Order[] = []; // Array per memorizzare gli ordini filtrati in base allo stato dell'ordine

  constructor(
    private userService: UserService,
    private orderService: OrderService
  ) {}

  // Metodo eseguito all'inizializzazione del componente
  ngOnInit(): void {
    this.getUsers();
    this.getOrders();

    // Inizializza gli utenti e gli ordini filtrati
    this.filteredUsers = this.users;
    this.filteredOrders = this.orders;
  }

  // Funzione di visualizzazione per l'autocompletamento dell'utente
  displayFn(user: User): string {
    return user && user.username ? user.username : '';
  }

  // Metodo per ottenere tutti gli ordini
  getOrders(): void {
    this.orderService.getAllOrders().subscribe(
      (orders) => {
        this.orders = orders;
        this.filteredOrders = orders;
      },
      (error) => {
        console.error('Errore nel recupero degli ordini:', error);
      }
    );
  }

  // Metodo per ottenere tutti gli utenti
  getUsers(): void {
    this.userService.getUsers().subscribe(
      (users) => {
        this.users = users;
        this.filteredUsers = users;
      },
      (error) => {
        console.error('Errore nel recupero degli utenti:', error);
      }
    );
  }

  // Metodo per filtrare i dati degli utenti e degli ordini
  filterData(): void {
    this.userService.searchUsers(this.selectedUserName).subscribe(
      (users) => {
        this.filteredUsers = users;
      },
      (error) => {
        console.error('Errore nella ricerca degli utenti:', error);
      }
    );

    this.orderService.searchOrderByUsername(this.selectedUserName, this.selectedOrderStatus).subscribe(
      (orders) => {
        this.filteredOrders = orders;
      },
      (error) => {
        console.error('Errore nella ricerca degli ordini:', error);
      }
    );
  }
}
