import { Component, ViewChild } from '@angular/core';
import { NotifyService } from "../../services/notify.service";
import { Notify } from "../../models/notify";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { OrderService } from 'src/app/services/order.service';
import { MatSnackBar } from '@angular/material/snack-bar';


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
  isAll: boolean = true; // true for All, false for Unread



  constructor(private notifyService: NotifyService,
    private authService: AuthService,
    private router: Router,
    private orderService: OrderService,
    private _snackBar: MatSnackBar) { }
  // per gestire il paginator
  pageEvent: PageEvent | undefined;
  length = 50;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25, 50];

  ngOnInit(): void {
    this.loadNotify();
    this.notifyService.modify.subscribe(d => {
      this.loadNotify();
    });
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    this.setNotificationsVariable();

  }
  setNotificationsVariable() {
    let elementi = this.pageSize


    if ((this.pageIndex + 1) * this.pageSize > this.notifications.length) {
      elementi = (this.notifications.length - this.pageIndex * this.pageSize)

    }
    console.log(elementi, this.pageIndex * this.pageSize, elementi);

    this.notificationsView = this.notifications.slice(this.pageIndex * this.pageSize, (this.pageIndex * this.pageSize) + elementi)
  }
  loadNotify() {
    const currentUser = this.authService.getUserFromToken();
    if (currentUser) {
      this.notifyService.getUserNotifications(currentUser.username).subscribe(
        (notifications: any[]) => {
          console.log('Notifications:', notifications);
          if (this.isAll) {
            this.notifications = notifications;
          } else {
            this.notifications = notifications.filter(notifica => !notifica.read)
          }
          this.setNotificationsVariable()
        }
      );
    }
  }

  openDetail(id: string) {
    if (id) {
      this.orderService.getOrder(id).subscribe(orderToPass => {
        if (orderToPass) {
          this.router.navigate(['/order/detail'], { state: { order: orderToPass } });
        }
      },
        (error: any) => {
          const message = 'Errore durante il recupero degli ingredienti';

          this._snackBar.open(message, 'Chiudi', {
            duration: 5 * 1000,
          });
          console.error(message, error);
        });
    }
  }

  deleteNotification(notificationId: string) {
    this.notifyService.deleteNotification(notificationId).subscribe(
      (response) => {
        console.log('Notifica eliminata con successo:', response);
        if (this.notificationsView.length == 1) {
          // this.startIndex = 0;
          // this.endIndex = this.pageSize;
          if (this.paginator) {
            this.paginator.firstPage();
          }
        }
        this.loadNotify();
        this.notifyService.notifySubscribers();
      }
    );
  }

  updateReadStatus(notification: Notify) {
    this.notifyService.updateNotification(notification._id, notification.read).subscribe(
      (response) => {
        console.log('Stato di lettura aggiornato con successo:', response);
        console.log("not------------: " + notification.read + " sec---------------: " + this.isAll);
        this.loadNotify();
      }
    );
  }
  setNotifications() {
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.loadNotify();
  }

}
