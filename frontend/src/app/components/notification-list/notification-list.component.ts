import { Component } from '@angular/core';
import {NotifyService} from "../../services/notify.service";
import {Notify} from "../../models/notify";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent {
  notifications: Notify[] = [];

  constructor(private notifyService: NotifyService, private authService: AuthService) { }

  ngOnInit(): void {
    // Recupera le notifiche dell'utente corrente quando la componente viene inizializzata
    const currentUser = this.authService.getUserFromToken();
    if (currentUser) {
      this.notifyService.getUserNotifications(currentUser.username).subscribe(
        (notifications: Notify[]) => {
          this.notifications = notifications;
        }
      );
    }
  }

}
