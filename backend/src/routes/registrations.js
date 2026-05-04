import express from "express";
import Registration from "../models/Registration.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { participantId, name, contact, batch, gender, events } = req.body;
    if (!participantId || !name || !contact || !batch || !gender) {
      return res.status(400).json({ error: "All required registration fields must be provided." });
    }

    if (!/^\d{10}$/.test(contact)) {
      return res.status(400).json({ error: "Contact number must be exactly 10 digits." });
    }

    const existing = await Registration.findOne({ participantId });
    if (existing) {
      return res.status(409).json({ error: "A registration with that ID already exists." });
    }

    const registration = await Registration.create({
      participantId,
      name,
      contact,
      batch,
      gender,
      events: Array.isArray(events) ? events : [events].filter(Boolean),
    });

    return res.status(201).json(registration);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unable to save registration." });
  }
});

router.get("/", async (req, res) => {
  try {
    const list = await Registration.find().sort({ createdAt: -1 });
    return res.json(list);
  } catch (error) {
    return res.status(500).json({ error: "Unable to load registrations." });
  }
});

export default router;
