require('dotenv').config();
const connectDB = require('./config/db');
const app = require('./app');
const PORT = process.env.PORT || 5000;

// Connect to MongoDB FIRST
connectDB().then(() => {
  // Start server ONLY after DB connection
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
