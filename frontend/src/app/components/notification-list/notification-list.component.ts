import { Component, ViewChild } from '@angular/core';
import { NotifyService } from "../../services/notify.service";
import { Notify } from "../../models/notify";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
import { Subscription } from "rxjs";

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
  section: boolean = false; // false for All, true for Unread

  constructor(
    private notifyService: NotifyService,
    private authService: AuthService,
    private router: Router
  ) { }

  pageSize: number = 5;
  currentPage: number = 1;
  startIndex: number = 0;
  endIndex: number = 5;
  private notifySubscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.loadNotify();
    this.notifyService.modify.subscribe(d => {
      console.log("entrato", d);
      this.loadNotify();
    });
  }

  ngOnDestroy(): void {
    if (this.notifySubscription) {
      this.notifySubscription.unsubscribe();
    }
  }

  loadNotify() {
    const currentUser = this.authService.getUserFromToken();
    if (currentUser) {
      this.notifyService.getUserNotifications(currentUser.username).subscribe(
        (notifications: any[]) => {
          console.log('Notifications:', notifications);
          this.notifications = notifications;
          if (this.section) {
            this.showUnread();
          } else {
            this.showAll();
          }
        }
      );
    }
  }

  openDetail(id: string) {
    this.router.navigate(['/order/detail'], { state: { orderId: id } });
  }

  deleteNotification(notificationId: string) {
    this.notifyService.deleteNotification(notificationId).subscribe(
      (response) => {
        console.log('Notifica eliminata con successo:', response);
        if (this.notificationsView.length == 1) {
          this.startIndex = 0;
          this.endIndex = this.pageSize;
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
        console.log("not------------: " + notification.read + " sec---------------: " + this.section);
        if (notification.read && this.section) {
          this.showUnread();
        }
        this.notifyService.notifySubscribers();
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
    this.filteredNotifications = this.notifications;
    this.notificationsView = this.notifications.slice(this.startIndex, this.endIndex);
    this.section = false; // All
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  showUnread() {
    this.filteredNotifications = this.notifications.filter(notification => !notification.read);
    this.notificationsView = this.filteredNotifications.slice(this.startIndex, this.endIndex);
    this.section = true; // Unread
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }
}
