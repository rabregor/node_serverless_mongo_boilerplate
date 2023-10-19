import { model, Schema } from "mongoose";

const Organization = new Schema(
  {
    name: { type: String, required: true },
    rfc: { type: String },
    numberOfEmployees: { type: String },
    fiscalPostcode: { type: String },
    fiscalStreet: { type: String },
    fiscalExteriorNumber: { type: String },
    fiscalColony: { type: String },
    fiscalCity: { type: String },
    fiscalState: { type: String },
    fiscalCountry: { type: String },
    organization: { type: String },
  },
  { timestamps: true, collection: "Organization" }
)

export default model("Organization", Organization);
