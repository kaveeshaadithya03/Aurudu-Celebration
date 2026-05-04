import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema({
  candidateId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  contact: { type: String, required: true },
  batch: { type: String, required: true },
  role: { type: String, enum: ["Prince", "Princess"], required: true },
  age: { type: Number, required: true },
  description: { type: String },
  profilePhotoUrl: { type: String, default: "https://via.placeholder.com/300x300?text=No+Photo" },
  profilePhotoPublicId: { type: String, default: "placeholder" },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  votes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Candidate = mongoose.models.Candidate || mongoose.model("Candidate", candidateSchema);
export default Candidate;
