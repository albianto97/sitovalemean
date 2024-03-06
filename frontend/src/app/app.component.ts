import { Component } from '@angular/core';
import { AuthService } from "./services/auth.service";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Gelateria';
  user: any;
  isAdmin: boolean = false;

  constructor(private authService: AuthService, private route: Router) {
    this.route.events.subscribe( d => {
      //console.log(d);
      if(d instanceof NavigationEnd) {
        this.user = authService.getUserFromToken();
        if (this.user)
          this.isAdmin = this.user.role == "amministratore";
        //console.log(d);
      }
    })

  }
    logOut() {
        this.authService.logout();
        location.reload();
        this.route.navigate(['/login']); //forse dopo admin è da togliere perche fa reload da solo
    }
}
