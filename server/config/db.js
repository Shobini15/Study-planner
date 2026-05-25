const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('Database Connection Error: MONGODB_URI is not set. Please add it to your .env file.');
    process.exit(1);
  }

  if (uri.includes('<username>') || uri.includes('<password>')) {
    console.error('Database Connection Error: MONGODB_URI contains placeholder credentials. Replace <username> and <password> in your .env with real Atlas credentials.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    if (error.message && error.message.includes('querySrv')) {
      console.error('Hint: SRV DNS lookup failed. Possible causes: network/DNS blocking, incorrect connection string, or Atlas IP whitelist. Try whitelisting your IP in Atlas, or use the non-SRV connection string provided by Atlas.');
    }
    process.exit(1);
  }
};

module.exports = connectDB;
