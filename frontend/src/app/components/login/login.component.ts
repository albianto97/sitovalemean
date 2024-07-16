import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { SocketService } from "../../services/socket.service";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  // Costruttore con iniezione delle dipendenze necessarie
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private socketService: SocketService,
    private _matSnackbar: MatSnackBar
  ) {
    // Inizializza il form di login con validazione per email e password
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // campo email con validazione
      password: ['', [Validators.required, Validators.minLength(6)]] // campo password con validazione
    });
  }

  // Metodo eseguito all'inizializzazione del componente
  ngOnInit() {
    console.log("Inizializzo: Log-In");
  }

  // Metodo chiamato al submit del form
  onSubmit() {
    // Controlla se il form è valido
    if (this.loginForm.valid) {
      // Crea un nuovo oggetto utente con i dati del form
      const newUser = new User(this.loginForm.value.email, "username", this.loginForm.value.password);
      
      // Chiama il metodo di login del servizio AuthService
      this.authService.login(newUser).subscribe(
        (response: any) => {
          // Connette il servizio socket
          this.socketService.connect();
          // Naviga alla pagina principale
          this.router.navigate(['']);
        },
        error => {
          // Mostra un messaggio di errore se il login fallisce
          const message = 'Credenziali inserite non corrette.';
          this._matSnackbar.open(message, 'Chiudi', {
            duration: 5 * 1000,
          });
          console.error('Errore durante il login', error);
        }
      );
    }
  }
}
