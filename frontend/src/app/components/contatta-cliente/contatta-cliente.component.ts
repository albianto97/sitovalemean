import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Notify } from 'src/app/models/notify';
import { NotifyService } from 'src/app/services/notify.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-contatta-cliente',
  templateUrl: './contatta-cliente.component.html',
  styleUrls: ['./contatta-cliente.component.css']
})
export class ContattaClienteComponent implements OnInit {

  orderId: string = '';
  message: string = '';
  utentiEmail: any[] = [];
  utentiUsername: any[] = [];
  username: string = "";
  isReply = true;
  isAutoset = false;
  isDisabled = false;

  constructor(
    private userService: UserService, 
    private notifyService: NotifyService,
    private socketService: SocketService,
    private _snackBar: MatSnackBar
  ) { }

  // Metodo eseguito all'inizializzazione del componente
  ngOnInit(): void {
    const state = history.state;
    if (state && state.username && state.orderId) {
      this.isAutoset = true;
      this.username = state.username;
      this.orderId = state.orderId;
    }

    this.userService.getUsers().subscribe(
      (users: any) => {
        users.forEach((user: any) => {
          if (user.ruolo != "amministratore") {
            this.utentiEmail.push({ key: user.username, value: user.email });
            this.utentiUsername.push({ key: user.username, value: user.username });
          }
        });
      },
      (error: any) => {
        console.error('Errore nel recupero degli utenti:', error);
      }
    );
  }

  // Metodo per inviare una notifica
  sendNotification() {
    this.isDisabled = true;
    const notifyDate = new Date();

    if (this.username) {
      this.socketService.sendNotification({ username: this.username, message: this.message });
      let replyMessage = '';
      if (this.isReply) {
        replyMessage = " <br> <i>Per rispondere a questo messaggio contattare l'amministrazione tramite<br> la <strong>chat in basso a destra</strong>.</i>";
      }

      this.notifyService.createNotify(this.username, notifyDate.toISOString(), this.orderId, false, this.message + replyMessage, "").subscribe(
        (notification: Notify) => {
          const message = 'La Notifica è stata inviata con successo!!!';
          this._snackBar.open(message, 'Chiudi', {
            duration: 5 * 1000,
          });
          this.isDisabled = false;
        },
        (error: any) => {
          const message = 'Errore nell\'invio della notifica';
          this._snackBar.open(message, 'Chiudi', {
            duration: 5 * 1000,
          });
          console.error(message, error);
          this.isDisabled = false;
        }
      );
    }
  }

  // Metodo per ripristinare i campi del form
  ripristina(): void {
    if (!this.isAutoset) {
      this.username = '';
    }
    this.message = '';
  }
}
