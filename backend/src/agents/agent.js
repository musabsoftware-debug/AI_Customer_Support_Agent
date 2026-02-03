import { Groq } from "groq-sdk";

// import { Travily } from "travily-sdk";
import { webSearch } from "./tavily.js";
import { searchKnowledgeBase } from "../rag/retriever.js";
import { tools } from "./tool.js";
import { SYSTEM_PROMPT } from "./prompt.js";
import { getMemory, saveMemory } from "../memory/memoryStore.js";

const groq = new Groq({
  api_key: process.env.GROQ_API_KEY,
});

export const runAgent = async ({ message, threadId }) => {
  const basePrompt = [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
  ];
  const messages = getMemory(threadId, basePrompt);
  messages.push({ role: "user", content: message });
  while (true) {
    try {
      const resposne = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages,
        tools,
        tool_choice: "auto",
        temperature: 0.2,
      });

      const agentMessage = resposne.choices[0].message;
      messages.push(agentMessage);
      
      if (agentMessage.content) {
          console.log(`[Agent] Response: ${agentMessage.content}`);
      }
  
      if (!agentMessage.tool_calls || agentMessage.tool_calls.length === 0) {
        saveMemory(threadId, messages);
        return agentMessage.content || "I'm sorry, I couldn't generate a response.";
      }
  
      for (let call of agentMessage.tool_calls) {
        console.log(`[Agent] Calling tool: ${call.name} with args:`, call.function.arguments);
        
        if (call.name === "searchKnowledgeBase") {
          const { query } = JSON.parse(call.function.arguments);
          const result = await searchKnowledgeBase(query);
          console.log(`[Agent] Tool ${call.name} returned result length: ${result.length}`);
  
          messages.push({
            role: "tool",
            tool_call_id: call.id,
            name: "searchKnowledgeBase",
            content: result,
          });
        } else if (call.name === "webSearch") {
          const { query } = JSON.parse(call.function.arguments);
          const result = await webSearch(query);
          console.log(`[Agent] Tool ${call.name} returned result length: ${result.length}`);
  
          messages.push({
            role: "tool",
            tool_call_id: call.id,
            name: "webSearch",
            content: result,
          });
        } else if (call.name === "escalateToHuman") {
          const { reason } = JSON.parse(call.function.arguments);
          const result = `Escalation noted. Reason: ${reason}. A human agent has been notified.`;
          console.log(`[Agent] Tool ${call.name} executed.`);
  
          messages.push({
              role: "tool",
              tool_call_id: call.id,
              name: "escalateToHuman",
              content: result,
            });
        }
      }
    } catch (error) {
      console.error("Error in agent loop:", error);
      return "I encountered an error while processing your request. Please try again later.";
    }
  }
};
