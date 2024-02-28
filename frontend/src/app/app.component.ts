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
    
      this.isAdmin = authService.isAdmin();
  }
}
