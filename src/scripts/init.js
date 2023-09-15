import * as models from "../models/index.js";
import bcrypt from "bcryptjs";
import { createUUID } from "../utils/functions.js";

(async () => {
  const rootOrg = new models.Organization({
    id: createUUID(),
    name: "NiPS",
  });
  rootOrg.save();

  const pwd = "123";
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(pwd, salt);

  const newUser = new models.User({
    password: hashedPassword,
    email: "admin@nips.mx",
    name: "NiPS",
    lastName: "Admin",
    type: "admin",
    isEnterprise: true,
    organization: rootOrg.id,
  });

  try {
    await newUser.save();
    console.log("Root successful!");
  } catch (error) {
    console.error(error);
  }
})();
