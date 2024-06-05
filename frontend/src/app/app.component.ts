import { Component } from '@angular/core';
import { AuthService } from "./services/auth.service";
import { NavigationEnd, Router } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';
import {SocketService} from "./services/socket.service";
import {NotifyService} from "./services/notify.service";
import {AdminDialogComponent} from "./components/admin-dialog/admin-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {UserService} from "./services/user.service";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Gelateria';
  user: any;
  isAdmin: boolean = false;
  unreadNotificationsCount: number = 0;
  showChatbox: boolean = false;



  constructor(private authService: AuthService, private route: Router, private socket: SocketService,
              private notifyService: NotifyService, private dialog: MatDialog, private userService: UserService) {
    this.route.events.subscribe(d => {
      if (d instanceof NavigationEnd) {
        this.showChatbox = !this.route.url.endsWith("/login");
        this.user = authService.getUserFromToken();
        if (this.user)
          this.isAdmin = this.user.role == "amministratore";
      }
    })
    this.countUnreadNotifications();
    this.notifyService.modify.subscribe(() => {
      this.countUnreadNotifications(); // Aggiorna il badge ogni volta che una notifica viene modificata
    });

  }

  ngOnInit(){
    this.countUnreadNotifications();
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
  openAdminDialog(): void {
    const dialogRef = this.dialog.open(AdminDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      if (result) {
        console.log(`User ${result} will be made an admin`);
        this.userService.addAdmin(result).subscribe(() => {
          console.log('User promoted to admin');
        })
      }else {
        console.log("Result is empty or undefined.");
      }
    });
  }
}
