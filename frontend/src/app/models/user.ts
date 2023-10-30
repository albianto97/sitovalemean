enum Ruolo {
    Amministratore = "amministratore",
    Utente = "utente"
}
export class User {
    id?: string;
    username: string;
    password: string;
    email: string;
    ruolo: Ruolo;

    constructor({ email, username, password }: { email: string, username: string, password: string }) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.ruolo = Ruolo.Utente; // Assegnamento di default al ruolo "Utente"
    }
}