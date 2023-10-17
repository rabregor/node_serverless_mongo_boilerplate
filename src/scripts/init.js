import * as models from "../models/index.js";
import bcrypt from "bcryptjs";
import connectDB from "../utils/connect.js"

(async () => {
  try {
    await connectDB();
    const rootOrg = new models.Organization({
      name: "NiPS",
      rfc: "123",
      numberOfEmployees: 1,
      fiscalPostcode: "123",
      fiscalStreet: "123",
      fiscalExteriorNumber: "123",
      fiscalColony: "123",
      fiscalCity: "123",
      fiscalState: "123",
      fiscalCountry: "123",
    });
    await rootOrg.save();
  
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
      organization: String(rootOrg._id),
    });
    await newUser.save();
    console.log("Root successful!");
    return
  } catch (error) {
    console.error(error);
  }
})();
