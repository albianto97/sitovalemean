import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, Status } from 'src/app/models/order';
import { SocketService } from "../../services/socket.service";
import { AuthService } from "../../services/auth.service";
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  @Input() order!: Order;
  @Input() selectUsername!: string;
  @Input() isProfile: boolean = false;
  isAdmin: boolean = false;
  username: string = "";

  constructor(
    private router: Router,
    private userService: UserService,
    private socketService: SocketService,
    public authService: AuthService
  ) { }

  // Metodo eseguito all'inizializzazione del componente
  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.userService.getUserById(this.order.user).subscribe(
      (user: User) => {
        this.username = user.username;
      },
      (error: any) => {
        console.error('Errore durante il recupero dell\'utente:', error);
      }
    );
  }

  // Metodo per ottenere l'icona dello stato dell'ordine
  getStatusIcon(status: string): string {
    let key = status as keyof typeof Status;
    return Status[key];
  }

  // Metodo per aprire i dettagli dell'ordine
  openDetail(orderPass: Order) {
    this.router.navigate(['/order/detail'], { state: { order: orderPass } });
  }

  // Metodo per inviare una notifica
  sendNotification(username: string | undefined) {
    if (username) {
      this.socketService.sendNotification({ username: username, message: "Ordine evaso" });
    } else {
      console.error('Username non fornito per la notifica');
    }
  }
}
