import express from "express";
import Registration from "../models/Registration.js";
import { protectStaff } from "../utils/authMiddleware.js";

const router = express.Router();

// Public registration
router.post("/", async (req, res) => {
  try {
    let { participantId, name, contact, batch, gender, events } = req.body;
    if (!participantId || !name || !contact || !batch || !gender) {
      return res.status(400).json({ error: "All required registration fields must be provided." });
    }

    participantId = participantId.toUpperCase();

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

// Staff: Get all registrations or search by name
router.get("/", protectStaff, async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = { name: { $regex: search, $options: "i" } };
    }
    const list = await Registration.find(query).sort({ createdAt: -1 });
    return res.json(list);
  } catch (error) {
    return res.status(500).json({ error: "Unable to load registrations." });
  }
});

// Staff: Get event participation analytics
router.get("/analytics", protectStaff, async (req, res) => {
  try {
    const registrations = await Registration.find();
    const eventCounts = {};

    registrations.forEach(reg => {
      reg.events.forEach(event => {
        eventCounts[event] = (eventCounts[event] || 0) + 1;
      });
    });

    // Convert to sorted array
    const sortedAnalytics = Object.entries(eventCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return res.json(sortedAnalytics);
  } catch (error) {
    return res.status(500).json({ error: "Unable to load analytics." });
  }
});

// Staff: Delete a registration
router.delete("/:id", protectStaff, async (req, res) => {
  try {
    const deleted = await Registration.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Registration not found." });
    return res.json({ message: "Registration deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Unable to delete registration." });
  }
});

export default router;
