import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../services/user.service";
import {User} from "../../../models/user";


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = []; // Qui puoi definire una classe interfaccia User se vuoi tipizzare i dati degli utenti

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    // Chiamata al servizio per ottenere la lista degli utenti al caricamento del componente
    this.getUsers();

  }

  getUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

}

