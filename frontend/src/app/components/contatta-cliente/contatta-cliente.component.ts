import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Notify } from 'src/app/models/notify';
import { NotifyService } from 'src/app/services/notify.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-contatta-cliente',
  templateUrl: './contatta-cliente.component.html',
  styleUrl: './contatta-cliente.component.css'
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
  constructor(private userService: UserService, private notifyService: NotifyService,
    private socketService: SocketService,
    private _snackBar: MatSnackBar) { }
  ngOnInit(): void {
    const state = history.state;
    if (state && state.username && state.orderId) {
      this.isAutoset = true;
      this.username = state.username;
      this.orderId = state.orderId;
    }

    this.userService.getUsers().subscribe((users: any) => {
      users.forEach((user: any) => {
        if (user.ruolo != "amministratore") {
          this.utentiEmail.push({ key: user.username, value: user.email });
          this.utentiUsername.push({ key: user.username, value: user.username });
        }
      });
    })
  }

  sendNotification() {
    this.isDisabled = true;
    // Recupera l'utente dall'ID
    const notifyDate = new Date(); // Ottieni la data corrente
    if (this.username) {
      // Invia la notifica utilizzando il nome utente recuperato      
      this.socketService.sendNotification({ username: this.username, message: this.message });
      var replyMessage = '';
      if (this.isReply)
        replyMessage = " <br> <i>Per rispondere a questo messaggio contattare l'amministrazione tramite<br> la <strong>chat in basso a destra</strong>.</i>"
      // Chiamata al metodo saveEvaso del servizio NotifyService
      this.notifyService.createNotify(this.username, notifyDate.toISOString(), this.orderId, false, this.message + replyMessage, "").subscribe(
        (notification: Notify) => {
          console.log("Notifica salvata con successo:", notification);
          // Gestisci la notifica salvata come preferisci
          this.notifyService.notifySubscribers();
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
        });
    }
  }

  ripristina(): void {
    if (!this.isAutoset)
      this.username = '';  // Clear the user selection
    this.message = '';
  }
}
