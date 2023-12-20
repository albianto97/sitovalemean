const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
userSchema.pre('save', function(next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;