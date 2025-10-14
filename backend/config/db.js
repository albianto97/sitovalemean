import mongoose from 'mongoose';

export const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error('MONGO_URI mancante nel file .env');
        process.exit(1);
    }
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect(uri);
        console.log('✅ Connesso a MongoDB');
    } catch (err) {
        console.error('Errore connessione MongoDB:', err.message);
        process.exit(1);
    }
};
