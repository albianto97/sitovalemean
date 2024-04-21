import { Component } from '@angular/core';
import {NotifyService} from "../../services/notify.service";
import {Notify} from "../../models/notify";
import {AuthService} from "../../services/auth.service";
import {Order} from "../../models/order";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent {
  notifications: Notify[] = [];

  constructor(private notifyService: NotifyService,
              private authService: AuthService,
              private router:Router) { }


  ngOnInit(): void {
    // Recupera le notifiche dell'utente corrente quando la componente viene inizializzata
    const currentUser = this.authService.getUserFromToken();
    if (currentUser) {
      this.notifyService.getUserNotifications(currentUser.username).subscribe(
        (notifications: any[]) => { // Ora notifications è un array
          console.log('Notifications:', notifications); // Controlla il formato dei dati ricevuti
          this.notifications = notifications;
        }
      );
    }
  }
  openDetail(id: string){
    this.router.navigate(['/order/detail'], { state: { orderId: id } });
  }



}
