import { Component } from '@angular/core';
import { AuthService } from "./services/auth.service";
import { NavigationEnd, Router } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';
import {SocketService} from "./services/socket.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Gelateria';
  user: any;
  isAdmin: boolean = false;

  constructor(private authService: AuthService, private route: Router, private socket: SocketService) {
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
}
