import models from "../models/index.js";
import bcrypt from "bcryptjs";
import connectDB from "./connect.js";

async function seedDB() {
  console.log("Seeding DB...");
  await connectDB();

  const pwd = "123";
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(pwd, salt);

  const newUser = new models.User({
    password: hashedPassword,
    email: "admin@gmail.com",
    name: "Admin",
    lastName: "Admin",
    type: "admin",
    phone: "123",
  });
  await newUser.save();
  console.log("Root successful!");
}

seedDB().catch((err) => {
  console.error(err);
  process.exit(1);
});
