import express from "express";
import multer from "multer";
import Candidate from "../models/Candidate.js";
import cloudinary from "../config/cloudinary.js";
import { protectStaff } from "../utils/authMiddleware.js";

const upload = multer({ storage: multer.memoryStorage() });

const uploadBuffer = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "seller_products",
        resource_type: "auto", // Changed to auto to handle different image types better
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary stream error:", error);
          return reject(error);
        }
        resolve(result);
      }
    );

    stream.end(buffer);
  });

const votingEndsAt = process.env.VOTING_END ? new Date(process.env.VOTING_END) : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

const createCandidatesRouter = (io) => {
  const router = express.Router();

  router.post("/", upload.single("profilePhoto"), async (req, res) => {
    try {
      let { candidateId, name, contact, batch, role, age, description } = req.body;
      if (!candidateId || !name || !contact || !batch || !role || !age) {
        return res.status(400).json({ error: "All required candidate fields must be provided." });
      }

      candidateId = candidateId.toUpperCase();

      // Check if candidate already exists (including rejected)
      const existing = await Candidate.findOne({ candidateId });
      if (existing) {
        if (existing.status === "rejected") {
          return res.status(403).json({ error: "This Student ID has been disqualified and cannot register again." });
        }
        return res.status(409).json({ error: "A candidate with this Student ID is already registered." });
      }

      if (!/^\d{10}$/.test(contact)) {
        return res.status(400).json({ error: "Contact number must be exactly 10 digits." });
      }

      const ageNum = Number(age);
      if (isNaN(ageNum) || ageNum < 15 || ageNum > 60) {
        return res.status(400).json({ error: "Age must be between 15 and 60." });
      }

      let profilePhotoPublicId = "placeholder";
      let profilePhotoUrl = "https://via.placeholder.com/300x300?text=No+Photo";

      if (req.file) {
        console.log("File received for upload:", req.file.originalname, "Size:", req.file.size);
        try {
          const uploadResult = await uploadBuffer(req.file.buffer);
          console.log("Cloudinary upload success:", uploadResult.secure_url);
          profilePhotoUrl = uploadResult.secure_url;
          profilePhotoPublicId = uploadResult.public_id;
        } catch (uploadError) {
          console.error("Cloudinary upload failed detail:", uploadError);
          // Continue with placeholder
        }
      } else {
        console.warn("No file found in req.file");
      }

      const candidate = await Candidate.create({
        candidateId,
        name,
        contact,
        batch,
        role,
        age: Number(age),
        description,
        profilePhotoUrl,
        profilePhotoPublicId,
      });

      console.log(`NEW CANDIDATE CREATED: ${candidate.name} (${candidate.candidateId})`);
      return res.status(201).json(candidate);
    } catch (error) {
      console.error("Error creating candidate:", error.message);
      return res.status(500).json({ error: "Unable to create candidate." });
    }
  });

  router.get("/", async (req, res) => {
    try {
      const candidates = await Candidate.find({ status: "approved" }).sort({ votes: -1, createdAt: 1 });
      return res.json({ candidates, votingEndsAt });
    } catch (error) {
      return res.status(500).json({ error: "Unable to load candidates." });
    }
  });

  router.get("/stats", protectStaff, async (req, res) => {
    try {
      const topPrincesses = await Candidate.find({ role: "Princess", status: "approved" }).sort({ votes: -1, createdAt: 1 }).limit(3);
      const topPrinces = await Candidate.find({ role: "Prince", status: "approved" }).sort({ votes: -1, createdAt: 1 }).limit(3);

      const princessCount = await Candidate.countDocuments({ role: "Princess", status: "approved" });
      const princeCount = await Candidate.countDocuments({ role: "Prince", status: "approved" });

      return res.json({
        topPrincesses,
        topPrinces,
        princessCount,
        princeCount
      });
    } catch (error) {
      return res.status(500).json({ error: "Unable to load candidate statistics." });
    }
  });

  router.get("/all", protectStaff, async (req, res) => {
    try {
      const candidates = await Candidate.find().sort({ createdAt: -1 });
      return res.json(candidates);
    } catch (error) {
      return res.status(500).json({ error: "Unable to load all candidates." });
    }
  });

  router.get("/pending", protectStaff, async (req, res) => {
    try {
      const pending = await Candidate.find({ status: "pending" }).sort({ createdAt: -1 });
      return res.json(pending);
    } catch (error) {
      return res.status(500).json({ error: "Unable to load pending candidates." });
    }
  });

  router.get("/:candidateId", async (req, res) => {
    try {
      const candidate = await Candidate.findOne({ candidateId: req.params.candidateId });
      if (!candidate) return res.status(404).json({ error: "Candidate not found." });

      // Calculate rank
      const approvedCandidates = await Candidate.find({ status: "approved" }).sort({ votes: -1, createdAt: 1 });
      const rank = approvedCandidates.findIndex(c => c.candidateId === candidate.candidateId) + 1;

      return res.json({ candidate, rank, votingEndsAt });
    } catch (error) {
      return res.status(500).json({ error: "Unable to load candidate details." });
    }
  });

  router.post("/:candidateId/vote", async (req, res) => {
    try {
      if (Date.now() > votingEndsAt.getTime()) {
        return res.status(400).json({ error: "Voting has ended." });
      }

      const candidate = await Candidate.findOne({ candidateId: req.params.candidateId, status: "approved" });
      if (!candidate) {
        return res.status(404).json({ error: "Candidate not found or not approved." });
      }

      candidate.votes += 1;
      await candidate.save();
      return res.json(candidate);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Unable to update vote." });
    }
  });

  router.put("/:candidateId/status", protectStaff, async (req, res) => {
    try {
      const { status } = req.body;
      console.log(`ATTEMPTING STATUS UPDATE: ID=${req.params.candidateId}, NEW_STATUS=${status}`);

      if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Status must be approved or rejected." });
      }

      const candidate = await Candidate.findOneAndUpdate(
        { candidateId: req.params.candidateId },
        { $set: { status: status } },
        { new: true } // Return the updated document
      );

      if (!candidate) {
        console.error(`UPDATE FAILED: Candidate ${req.params.candidateId} not found in DB`);
        return res.status(404).json({ error: "Candidate not found." });
      }

      console.log(`UPDATE SUCCESS: ${candidate.name} is now ${candidate.status}`);

      return res.json(candidate);
    } catch (error) {
      console.error("DATABASE UPDATE ERROR:", error);
      return res.status(500).json({ error: "Unable to update candidate status." });
    }
  });

  return router;
};

export default createCandidatesRouter;
