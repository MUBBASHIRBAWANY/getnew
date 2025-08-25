import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const URL = process.env.URL;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function db() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((mongoose) => {
        console.log("Database Connected ✅");
        return mongoose;
      })
      .catch((err) => {
        console.error("Database Connection Error ❌:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default db;
