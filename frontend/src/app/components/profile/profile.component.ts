import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})


export class ProfiloComponent implements OnInit {
  user: any; // Assicurati che il tipo sia appropriato

  constructor(private http: HttpClient, private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getProfile().subscribe((data) => {
      this.user = data;
    });
  }

}
