import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () =>
      console.log(`✅ API in ascolto su http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error('❌ Errore avvio server:', err);
    process.exit(1);
  }
})();
