import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

//Configuracion de conexión mongo

async function db() {
  const dbUri = process.env.MG_DB_URI as string;
  try {
    await mongoose
      .connect(dbUri)
      .then(() => {
        console.log(`DB connected to MongoDB`);
      });
  } catch (e) {
    console.error(e);
  }
}

export default db;
