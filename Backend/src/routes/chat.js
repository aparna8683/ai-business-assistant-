import express from "express";
import { runAI } from "../services/ai.js";
import business from "../data/business.json" with { type: "json" };

console.log("🏥 Business loaded:", business);

const router = express.Router();

router.post("/", async (req, res) => {
  console.log("📩 Chat request received");

  try {
    const { message } = req.body;

    console.log("Message:", message);

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const prompt = `
You are the customer support assistant for ${business.businessName}.

BUSINESS INFORMATION:

Business Name:
${business.businessName}

Business Type:
${business.businessType}

Location:
${business.location}

Opening Hours:
${business.hours}

Services:
${business.services.join(", ")}

Contact Phone:
${business.contact.phone}

Contact Email:
${business.contact.email}

Appointments:
${business.appointment.message}

Emergency Assistance:
${business.emergency.message}


AI RULES:

${business.aiRules
  .map((rule, index) => `${index + 1}. ${rule}`)
  .join("\n")}


CUSTOMER MESSAGE:
${message}
`;

    console.log("🤖 Calling Groq with business knowledge...");
    console.log("🧠 PROMPT BEING SENT:");
    console.log(prompt);

    const reply = await runAI(prompt);

    console.log("✅ Groq responded");

    res.json({
      reply,
    });
  } catch (error) {
    console.error("❌ Chat error:", error);

    res.status(500).json({
      error: error.message,
    });
  }
});

export default router;