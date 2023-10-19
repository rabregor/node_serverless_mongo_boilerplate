import { model, Schema } from "mongoose";

const Organization = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    rfc: {
      type: String,
      required: true,
    },
    numberOfEmployees: {
      type: Number,
      required: true,
    },
    fiscalPostcode: {
      type: String,
      required: true,
    },
    fiscalStreet: {
      type: String,
      required: true,
    },
    fiscalExteriorNumber: {
      type: String,
      required: true,
    },
    fiscalColony: {
      type: String,
      required: true,
    },
    fiscalCity: {
      type: String,
      required: true,
    },
    fiscalState: {
      type: String,
      required: true,
    },
    fiscalCountry: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, collection: "Organization" },
);

export default model("Organization", Organization);
