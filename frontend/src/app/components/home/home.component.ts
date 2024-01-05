import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  user: User | undefined;
  constructor(private auth: AuthService){
    
  }
  ngOnInit(): void {
    this.user = this.auth.getUserFromToken();
  }
  
}