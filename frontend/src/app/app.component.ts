import { Component } from '@angular/core';
import { AuthService } from "./services/auth.service";
import { NavigationEnd, Router } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';
import {SocketService} from "./services/socket.service";
import {NotifyService} from "./services/notify.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Gelateria';
  user: any;
  isAdmin: boolean = false;
  unreadNotificationsCount: number = 0; // Contatore delle notifiche non lette


  constructor(private authService: AuthService, private route: Router, private socket: SocketService, private notifyService: NotifyService) {
    this.route.events.subscribe( d => {
      if(d instanceof NavigationEnd) {
        this.user = authService.getUserFromToken();
        if (this.user)
          this.isAdmin = this.user.role == "amministratore";
        //console.log(d);
      }
    })
    console.log(socket);
  }
  countUnreadNotifications() {
    const currentUser = this.authService.getUserFromToken();
    if (currentUser) {
      this.notifyService.getUserNotifications(currentUser.username).subscribe(
        (notifications: any[]) => {
          // Filtra le notifiche non lette
          this.unreadNotificationsCount = notifications.filter(notification => !notification.read).length;
          // Aggiorna il contatore
        }
      );
    }
  }
}
