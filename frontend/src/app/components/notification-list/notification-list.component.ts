import { Component, ViewChild } from '@angular/core';
import { NotifyService } from "../../services/notify.service";
import { Notify } from "../../models/notify";
import { AuthService } from "../../services/auth.service";
import { Order } from "../../models/order";
import { ActivatedRoute, Router } from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent {
  notifications: Notify[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  notificationsView: Notify[] = [];
  filteredNotifications: Notify[] = [];
  section: boolean = false; //false All, true notRead

  constructor(private notifyService: NotifyService,
              private authService: AuthService,
              private router: Router) { }
  pageSize: number = 5;
  currentPage: number = 1;
  startIndex: number = 0;
  endIndex: number = 5;


  ngOnInit(): void {
    this.loadNotify();

  }
  loadNotify() {
    // Recupera le notifiche dell'utente corrente quando la componente viene inizializzata
    const currentUser = this.authService.getUserFromToken();
    if (currentUser) {
      this.notifyService.getUserNotifications(currentUser.username).subscribe(
        (notifications: any[]) => { // Ora notifications è un array
          console.log('Notifications:', notifications); // Controlla il formato dei dati ricevuti
          this.notifications = notifications;
          this.notificationsView = this.notifications.slice(this.startIndex, this.endIndex);
          this.filteredNotifications = this.notifications;
        }
      );
    }
  }
  openDetail(id: string) {
    this.router.navigate(['/order/detail'], { state: { orderId: id } });
  }
  deleteNotification(notificationId: string) {
    // Chiama il metodo del servizio per eliminare la notifica
    this.notifyService.deleteNotification(notificationId).subscribe(
      (response) => {
        console.log('Notifica eliminata con successo:', response);
        // Ricarica le notifiche dopo l'eliminazione
        if (this.notificationsView.length == 1) {
          this.startIndex = 0;
          this.endIndex = this.pageSize;
          if (this.paginator) {
            this.paginator.firstPage();
          }
        }
        this.loadNotify();
      }
    );
  }

  updateReadStatus(notification: Notify) {
    this.notifyService.updateNotification(notification._id, notification.read).subscribe(
      (response) => {
        console.log('Stato di lettura aggiornato con successo:', response);
        if (notification.read && !this.section) {
          // La notifica è stata contrassegnata come letta, quindi ricarica solo le notifiche non lette rimanenti
          this.showUnread();

        }
      }
    );
  }


  onPageChange(event: any): void {
    this.startIndex = event.pageIndex * event.pageSize;
    this.endIndex = this.startIndex + event.pageSize;
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;

    this.notificationsView = this.filteredNotifications.slice(this.startIndex, this.endIndex);
  }

  showAll() {
    this.notificationsView = this.notifications.slice(this.startIndex, this.endIndex);
    this.filteredNotifications = this.notifications;
    this.section = true; //All
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  showUnread() {
    this.filteredNotifications = this.notifications.filter(notification => !notification.read);
    this.notificationsView = this.filteredNotifications.slice(this.startIndex, this.endIndex);
    this.section = false; //notRead
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

}
