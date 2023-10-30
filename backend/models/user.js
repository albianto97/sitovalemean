const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password:  {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    ruolo: {
        type: String,
        enum: ['amministratore', 'utente'], // Specifica un elenco di valori validi
        required: true
      }
    
});

const User = mongoose.model('users', userSchema);

module.exports = User;