import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


// TODO: CRITTOGRAFARE PASSWORD;
// TODO: branch SignIn --> controllo che non sia già presente nome ed email;  // testare --> errore in console (ispeziona) se giusto?
// TODO: branch Profile --> branch creato per singola persona --> con stato mettere la persona che ha fatto login;
// TODO: creazione prodotto fatta, bisogna gestire in maniera diversa il 400/404?
// TODO: branch Ordine --> creazione ordine, rotte per accettazione e rifiuto fatte (da testare)
