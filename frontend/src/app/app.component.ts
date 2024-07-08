import { Component, OnInit } from '@angular/core';
import { AuthService } from "./services/auth.service";
import { NavigationEnd, Router } from "@angular/router";
import { SocketService } from "./services/socket.service";
import { NotifyService } from "./services/notify.service";
import { AdminDialogComponent } from "./components/admin-dialog/admin-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { UserService } from "./services/user.service";
import { MenuItem } from 'ngx-zeus-ui';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Gelateria';
  tel = './assets/media/logo.png';
  des = './assets/media/logo.png';
  user: any;
  isAdmin: boolean = false;
  unreadNotificationsCount: number = 0;
  showChatbox: boolean = false;
  link:MenuItem[] =[]
  linkAdmin: MenuItem[] = [
    new MenuItem("Home", "/", true, false, { tipo: "fas", icona: "igloo" }, true),
    new MenuItem("Prodotti", "/productList", true, false, { tipo: "fas", icona: "ice-cream" }, true),
    new MenuItem("Ordini", "/orders", true, false, { tipo: "fas", icona: "box" }, true),
    new MenuItem("Ingredienti", "/ingredients", true, false, { tipo: "fas", icona: "wheat-awn" }, true),
    new MenuItem("Messaggi", "/notifications", true, false, { tipo: "fas", icona: "comments" }, true),
  ];
  linkUser: MenuItem[] = [
    new MenuItem("Home", "/", true, false, { tipo: "fas", icona: "igloo" }, true),
    new MenuItem("Prodotti", "/productList", true, false, { tipo: "fas", icona: "ice-cream" }, true),
    new MenuItem("Ordini", "/orders", true, false, { tipo: "fas", icona: "box" }, true),
    new MenuItem("Profilo", "/profilo", true, false, { tipo: "fas", icona: "user" }, true),
    new MenuItem("Messaggi", "/notifications", true, false, { tipo: "fas", icona: "comments" }, true),
  ];


  constructor(private authService: AuthService,
    private route: Router,
    private socket: SocketService,
    private notifyService: NotifyService,
    private dialog: MatDialog,
    private userService: UserService) {
    this.route.events.subscribe(d => {
      if (d instanceof NavigationEnd) {
        this.showChatbox = !this.route.url.endsWith("/login") && !this.route.url.endsWith("/sign-in");
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

  ngOnInit() {
    this.user = this.authService.getUserFromToken();
    if (this.user)
      this.isAdmin = this.user.role == "amministratore";
    if(this.isAdmin){
      this.link = this.linkAdmin;
    }else{
      this.link = this.linkUser;
    }
    if(this.authService.isAuthenticated()){
      this.link.push(new MenuItem("Esci", "/logout", true, false, { tipo: "fas", icona: "right-from-bracket" }, true))
    }else{
      this.link.push(new MenuItem("Accedi", "/login", true, false, { tipo: "fas", icona: "user" }, true))
    }

    this.countUnreadNotifications();
  }

  countUnreadNotifications() {
    const currentUser = this.authService.getUserFromToken();
    if (currentUser) {
      this.notifyService.getUserNotifications(currentUser.username).subscribe(
        (notifications: any[]) => {
          // Aggiorna il contatore
          this.notifyService.notifySubscribers();
          // Filtra le notifiche non lette
          this.unreadNotificationsCount = notifications.filter(notification => !notification.read).length;
          this.notifyService.notifyTable(); // Notifica i cambiamenti

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
      } else {
        console.log("Result is empty or undefined.");
      }
    });
  }
}
