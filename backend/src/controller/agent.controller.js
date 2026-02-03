import { response } from "express";
import { runAgent } from "../agents/agent.js";

export async function chatController(req,res){
    try {
        const {message , threadId } = req.body ;
        const response = await runAgent({message, threadId: threadId || Date.now().toString()});
        return res.status(200).json({response},"get response successfully");
    } catch (error) {
        console.log(error.message);
        return res.status(500).json(response,"An error occurred");
    }
}