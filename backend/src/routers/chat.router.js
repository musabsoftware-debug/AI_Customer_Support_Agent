import express from "express";
// import { runAgent } from "../agents/agent.js";
import { chatController } from "../controller/agent.controller.js";

const router = express.Router();

router.post("/customerChat", chatController);

export default router;
