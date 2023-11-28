enum Ruolo {
    Amministratore = "amministratore",
    Utente = "utente"
}
export class User {
    _id?: string;
    username: string;
    password: string;
    email: string;
    ruolo: Ruolo;

    constructor({ _id,email, username, password }: { _id?: string, email: string, username: string, password: string }) {
      this._id = _id;
      this.email = email;
      this.username = username;
      this.password = password;
      this.ruolo = Ruolo.Utente; // Assegnamento di default al ruolo "Utente"
    }
}
