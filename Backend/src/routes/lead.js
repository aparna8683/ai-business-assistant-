import express from "express";
import Lead from "../models/Lead.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();


router.get("/", requireAuth, async (req, res) => {
  try {
    const leads = await Lead.find()
      .sort({ createdAt: -1 });

    res.json({
      leads,
    });
  } catch (error) {
    console.error("❌ Failed to fetch leads:", error);

    res.status(500).json({
      error: "Failed to fetch leads",
    });
  }
});


router.patch("/:id/status", requireAuth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["new", "contacted", "closed"].includes(status)) {
      return res.status(400).json({
        error: "Invalid status",
      });
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({
        error: "Lead not found",
      });
    }

    res.json({
      message: "Lead status updated successfully",
      lead,
    });
  } catch (error) {
    console.error("❌ Failed to update lead status:", error);

    res.status(500).json({
      error: "Failed to update lead status",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, phone, treatment } = req.body;

    if (!name || !phone || !treatment) {
      return res.status(400).json({
        error: "Name, phone and treatment are required",
      });
    }

    const lead = await Lead.create({
      name,
      phone,
      treatment,
    });

    console.log("🎯 Lead saved:", lead);

    res.status(201).json({
      message: "Lead saved successfully",
      lead,
    });
  } catch (error) {
    console.error("❌ Lead save error:", error);

    res.status(500).json({
      error: "Failed to save lead",
    });
  }
});

export default router;