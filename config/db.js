const mongoose = require('mongoose');

const connectDB = async () => {
  const URI = process.env.MONGO_URI;
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  };
  try {
    const conn = await mongoose.connect(URI, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('err');
    process.exit(1);
  }
}

module.exports = connectDB;