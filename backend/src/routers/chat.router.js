import express from "express";
import { runAgent } from "../agents/agent.js";

const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const { message, threadId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await runAgent({ message, threadId: threadId || Date.now().toString() });
    
    res.json({ response });
  } catch (error) {
    console.error("Error in chat router:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
