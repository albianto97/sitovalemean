import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import {MatSnackBar} from "@angular/material/snack-bar";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: any;

  constructor(private snackBar: MatSnackBar) {
    // Connetti al server Socket.IO
    this.socket = io('http://localhost:3000');
    this.socket.on("welcome", (data: any) =>{
      console.log("messaggio: " + data);
    });
    //console.log(this.socket);
    this.receiveNotification();
  }

  receiveNotification(){
    this.socket.on('notification', (data: any) => {
    console.log('Notifica ricevuta:', data);
    // Emetti l'evento tramite un Observable
      this.snackBar.open(data.message, 'Chiudi', {
        duration: 3000
      });
    });
  }

  // Metodo per inviare una notifica
  sendNotification(notification: any) {
    this.socket.emit('sendNotification', notification);
    /*this.snackBar.open(notification.message, 'Chiudi', {
      duration: 3000, // Durata della notifica in millisecondi (3 secondi)
    });*/
  }


}
