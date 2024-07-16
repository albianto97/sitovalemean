import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  registrazioneForm: FormGroup;

  // Costruttore con iniezione delle dipendenze necessarie
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Inizializza il form di registrazione con validazione
    this.registrazioneForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Metodo eseguito all'inizializzazione del componente
  ngOnInit(): void {
    console.log("Creazione Componente Registrazione");
  }

  // Metodo chiamato al submit del form
  onSubmit() {
    if (this.registrazioneForm.valid) {
      const newUser = new User(
        this.registrazioneForm.value.email,
        this.registrazioneForm.value.username,
        this.registrazioneForm.value.password
      );

      // Disabilita il form per evitare invii di richieste multiple
      this.registrazioneForm.disable();

      // Chiama il servizio per creare un nuovo utente
      this.userService.createUser(newUser).subscribe(
        (response: any) => {
          // L'utente è stato creato con successo
          console.log(response);
          this.openSnackBar(response.message);
          this.router.navigate(['/login']);
        },
        // Gestione dell'errore
        (errorResult: any) => {
          // Riattiva il form per poter modificare i campi
          this.registrazioneForm.enable();
          const error = errorResult.error;
          console.error(error.message);
          this.openSnackBar(error.message);
        }
      );
    }
  }

  // Metodo per aprire lo snackbar con un messaggio
  openSnackBar(message: string, action: string = 'OK') {
    this.snackBar.open(message, action, { duration: 5000 });
  }
}
