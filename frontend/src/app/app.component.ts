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

  constructor(private authService: AuthService, private router: Router) {

      this.isAdmin = authService.isAdmin();
  }
    //da eliminare perche duplicato
    logOut() {
        this.authService.logout();
        location.reload();
        this.router.navigate(['/login']); //forse dopo admin è da togliere perche fa reload da solo
    }
}
