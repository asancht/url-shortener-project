import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function db() {
  const dbUri = process.env.MG_DB_URI as string;
  try {
    await mongoose
      .connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        console.log(`DB connected to MongoDB`);
      });
  } catch (e) {
    console.error(e);
  }
}

export default db;
