import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import {MatSnackBar} from "@angular/material/snack-bar";
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: any;

  constructor(private snackBar: MatSnackBar, private authService: AuthService) {
    this.connect();
  }
  connect(){
    // Connetti al server Socket.IO
    if(this.socket && this.socket.isConnected){
      this.socket.disconnect();
    }
    this.socket = io('http://localhost:3000', {
      extraHeaders: {Authorization: "Bearer " + this.authService.getTokenFromLocalStorage()}
    });
    console.log("socket connected");
    //console.log(this.socket);
    this.registerHandlers();
  }

  registerHandlers(){
    this.socket.on('notification', (data: any) => {
      console.log('Notifica ricevuta:', data);
    // Emetti l'evento tramite un Observable
      this.snackBarMessage(data);
    });
    this.socket.on('update', (data: any) => {
      console.log('Notifica ricevuta:', data);
      // Emetti l'evento tramite un Observable
      this.snackBarMessage(data);
    });
    this.socket.on("welcome", (data: any) =>{
      console.log("messaggio: " + data);
    });
    this.socket.on('productAvailable', (data: any) => {
      console.log('Notifica ricevuta:', data);
      // Emetti l'evento tramite un Observable
      this.snackBarMessage(data);
    });

  }
  snackBarMessage(data: any){
    this.snackBar.open(data.message, 'Chiudi', {
      duration: 3000
    });
  }

  // Metodo per inviare una notifica
  sendNotification(notification: any) {
    this.socket.emit('sendNotification', notification);
  }


}
