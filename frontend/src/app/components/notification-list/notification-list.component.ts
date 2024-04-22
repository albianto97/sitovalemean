import {Component, ViewChild} from '@angular/core';
import {NotifyService} from "../../services/notify.service";
import {Notify} from "../../models/notify";
import {AuthService} from "../../services/auth.service";
import {Order} from "../../models/order";
import {ActivatedRoute, Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent {
  notifications: Notify[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  notificationsView: Notify[] = [];

  constructor(private notifyService: NotifyService,
              private authService: AuthService,
              private router:Router) { }
  pageSize: number = 5;
  currentPage: number = 1;
  startIndex: number = 0;
  endIndex: number = 5;


  ngOnInit(): void {
    this.loadNotify();

  }
  loadNotify(){
    // Recupera le notifiche dell'utente corrente quando la componente viene inizializzata
    const currentUser = this.authService.getUserFromToken();
    if (currentUser) {
      this.notifyService.getUserNotifications(currentUser.username).subscribe(
        (notifications: any[]) => { // Ora notifications è un array
          console.log('Notifications:', notifications); // Controlla il formato dei dati ricevuti
          this.notifications = notifications;
          // Aggiorna myOrdersView con la porzione corretta degli ordini
          this.notificationsView = this.notifications.slice(this.startIndex, this.endIndex);
        }
      );
    }
  }
  openDetail(id: string){
    this.router.navigate(['/order/detail'], { state: { orderId: id } });
  }
  deleteNotification(notificationId: string) {
    // Chiama il metodo del servizio per eliminare la notifica
    this.notifyService.deleteNotification(notificationId).subscribe(
      (response) => {
        console.log('Notifica eliminata con successo:', response);
        // Ricarica le notifiche dopo l'eliminazione
        if(this.notificationsView.length == 1){
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


  onPageChange(event: any): void {
    this.startIndex = event.pageIndex * event.pageSize;
    this.endIndex = this.startIndex + event.pageSize;
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;

    // Aggiorna myOrdersView con la porzione corretta degli ordini
    this.notificationsView = this.notifications.slice(this.startIndex, this.endIndex);
  }

  updateReadStatus(notification: any) {
    this.notifyService.updateNotification(notification._id, notification.read).subscribe(
      (response) => {
        console.log('Stato di lettura aggiornato con successo:', response);
      }
    );
  }
}
