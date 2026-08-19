const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not set. Configure it in the deployment environment.');
  }

  if (uri.includes('<username>') || uri.includes('<password>')) {
    throw new Error('MONGODB_URI contains placeholder credentials. Configure a real MongoDB connection string.');
  }

  const options = {
    serverSelectionTimeoutMS: 10000,
  };

  // Retry loop for transient TLS/DNS/network issues
  const maxAttempts = 5;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const conn = await mongoose.connect(uri, options);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`Database Connection Error (attempt ${attempt}): ${error.message}`);
      // Helpful hints for common failures
      if (error.message && error.message.includes('querySrv')) {
        console.error('Hint: SRV DNS lookup failed. Possible causes: network/DNS blocking, incorrect connection string, or Atlas IP whitelist. Try whitelisting your IP in Atlas, or use the non-SRV connection string provided by Atlas.');
      }
      if (error.message && (error.message.toLowerCase().includes('ssl') || error.message.toLowerCase().includes('tls') || error.message.includes('E05B0000'))) {
        console.error('Hint: TLS/SSL handshake failed. Ensure your environment supports TLS 1.2+. Check your OpenSSL/Node build and the Atlas cluster TLS requirements.');
      }

      if (attempt < maxAttempts) {
        const backoff = attempt * 2000;
        console.log(`Retrying in ${backoff / 1000}s...`);
        await new Promise((r) => setTimeout(r, backoff));
        continue;
      }

      throw error;
    }
  }
};

module.exports = connectDB;
