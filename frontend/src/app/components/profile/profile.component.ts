import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user";
import {AuthService} from "../../services/auth.service";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})


export class ProfiloComponent implements OnInit {
  user: User | undefined;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.user = this.auth.getUserFromToken();
  }

}
