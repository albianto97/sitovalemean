import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from "./auth.service";
import { NotifyService } from './notify.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: any;

  constructor(
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private notificationService: NotifyService
  ) {
    this.connect(); // Connetti al server Socket.IO all'inizializzazione del servizio
  }

  // Metodo per connettersi al server Socket.IO
  connect() {
    // Se esiste una connessione socket precedente, disconnetti
    if (this.socket && this.socket.isConnected) {
      this.socket.disconnect();
    }

    // Inizializza una nuova connessione socket
    this.socket = io(environment.socket, {
      extraHeaders: { Authorization: "Bearer " + this.authService.getTokenFromLocalStorage() }
    });
    console.log("socket connected");

    // Registra gli handler per gli eventi socket
    this.registerHandlers();
  }

  // Metodo per registrare gli handler per i messaggi di chat
  registerChatHandlers(callback: any) {
    this.socket.onAny((eventName: any, data: any) => callback(eventName, data));
  }

  // Metodo per registrare gli handler per gli eventi socket
  registerHandlers() {
    // Handler per le notifiche
    this.socket.on('notification', (data: any) => {
      console.log('Notifica ricevuta:', data);
      this.notificationService.notifySubscribers();
      this.snackBarMessage(data);
    });

    // Handler per gli aggiornamenti
    this.socket.on('update', (data: any) => {
      console.log('Notifica ricevuta:', data);
      this.snackBarMessage(data);
    });

    // Handler per il messaggio di benvenuto
    this.socket.on("welcome", (data: any) => {
      console.log("messaggio: " + data);
    });

    // Handler per la notifica di disponibilità del prodotto
    this.socket.on('productAvailable', (data: any) => {
      console.log('Notifica ricevuta:', data);
      this.snackBarMessage(data);
    });
  }

  // Metodo per mostrare un messaggio di snackbar
  snackBarMessage(data: any) {
    this.snackBar.open(data.message, 'Chiudi', {
      duration: 3000
    });
  }

  // Metodo per inviare una notifica a tutti
  sendNotification(notification: any) {
    this.socket.emit('sendNotification', notification);
  }

  // Metodo per inviare un messaggio di chat
  sendMessage(message: any) {
    this.socket.emit('messageSent', message);
  }

  // Metodo per notificare che la chat è stata visualizzata
  notifyChatDisplayed(currentUser: string, remoteUser: string) {
    this.socket.emit('chatDisplayed', { currentUser: currentUser, remoteUser: remoteUser });
  }
}
