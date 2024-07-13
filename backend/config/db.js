const mongoose = require('mongoose');
const config = require('../config');
const User = require('../models/user');

const connectDB = async () => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
  }).then(() => {
    console.log('Connected to MongoDB');
    createAdminUser();
  }).catch(err => console.error('Could not connect to MongoDB...', err));
};

async function createAdminUser() {
  const adminUsername = config.adminUsername;
  const adminPassword = config.adminPassword;
  const adminEmail = config.adminEmail;
  const adminRole = 'amministratore';

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
