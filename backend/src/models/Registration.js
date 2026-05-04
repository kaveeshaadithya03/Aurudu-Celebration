import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
  participantId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  contact: { type: String, required: true },
  batch: { type: String, required: true },
  gender: { type: String, required: true },
  events: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

const Registration = mongoose.models.Registration || mongoose.model("Registration", registrationSchema);
export default Registration;
