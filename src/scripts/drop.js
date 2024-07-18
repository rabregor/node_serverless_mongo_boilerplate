import mongoose from "mongoose";
import connect from "./connect.js";
import { env } from "../config/environment.js";

if (env.development) {
  (async () => {
    console.log("🧨 Dropping tables...");

    await connect();
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();

    console.log("💥 Database clean");
  })();
} else {
  console.error(
    "🚫 Can't run this script on a staging/production environment!",
  );
}
