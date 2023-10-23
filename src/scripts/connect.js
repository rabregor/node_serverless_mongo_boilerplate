import mongoose from "mongoose";
import { mongo } from "../config/environment.js";
import { mongoOptions } from "../utils/constants.js";

let isConnected;
let db;

const connectDB = async () => {
  if (isConnected) return db;
  try {
    db = await mongoose.connect(mongo.url, mongoOptions);
    isConnected = db.connections[0].readyState;
    console.log("Connected to MongoDB!");
    return db;
  } catch (err) {
    throw new Error(err);
  }
};

export default connectDB;
