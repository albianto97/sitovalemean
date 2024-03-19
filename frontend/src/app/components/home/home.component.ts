import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  isAdmin: boolean = false;
  constructor(private router: Router, private authService: AuthService){
    this.isAdmin = authService.isAdmin();
  }
  ordina(){
    this.router.navigate(['/productList']);
    // va indirizzato nella lista degli articoli
  }
  ngOnInit(): void {
  }

}
