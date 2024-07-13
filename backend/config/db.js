
const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');
const User = require('../models/user');

const connectDB = async () => {

    mongoose.set('strictQuery', true);
    await mongoose.connect(db, {
      useNewUrlParser: true,
    }).then(() => {
      console.log('Connected to MongoDB');
      createAdminUser(); // Crea l'utente admin all'avvio
    }).catch(err => console.error('Could not connect to MongoDB...', err));
};
// Funzione per creare l'utente admin
async function createAdminUser() {
  const adminUsername = 'admin';
  const adminPassword = '123456'; // Assicurati di utilizzare una password sicura e possibilmente di crittografarla
  const adminEmail = 'admin@admin.it';
  const adminRole = 'amministratore';

  // Verifica se l'utente admin esiste già
  const existingAdmin = await User.findOne({ username: adminUsername });

  if (!existingAdmin) {
    const adminUser = new User({
      username: adminUsername,
      password: adminPassword,
      email: adminEmail,
      ruolo: adminRole
    });

    try {
      await adminUser.save();
      console.log('Admin user created successfully');
    } catch (err) {
      console.error('Error creating admin user:', err);
    }
  } else {
    console.log('Admin user already exists');
  }
}

module.exports = connectDB;
