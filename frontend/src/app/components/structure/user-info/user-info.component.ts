import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  user: User | undefined;
  saluto: string = "";
  constructor(private auth: AuthService) {

  }
  ngOnInit(): void {
    this.user = this.auth.getUserFromToken();
    this.calcolaSaluto();
  }
  calcolaSaluto() {
    const oraCorrente = new Date().getHours();

    if (oraCorrente >= 5 && oraCorrente < 12) {
      this.saluto = 'Buongiorno, ' + this.user?.username + '!';
    } else if (oraCorrente >= 12 && oraCorrente < 18) {
      this.saluto = 'Buon pomeriggio, ' + this.user?.username + '!';
    } else {
      this.saluto = 'Buonasera, ' + this.user?.username + '!';
    }
  }
  logOut(){
    this.auth.logout();
    location.reload();
  }
}