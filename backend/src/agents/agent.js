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
    const resposne = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      tools,
      tool_choice: "auto",
      temperature: 0.2,
    });
    const agentMessage = resposne.choices[0].message;
    messages.push(agentMessage);
    if (!agentMessage.tool_calls) {
      saveMemory(threadId, messages);
      return agentMessage.content;
    }
    for (let call of agentMessage.tool_calls) {
      if (call.name === "searchKnowledgeBase") {
        const { query } = JSON.parse(call.function.arguments);
        const result = await searchKnowledgeBase(query);

        messages.push({
          role: "tool",
          tool_call_id: call.id,
          name: "searchKnowledgeBase",
          content: result,
        });
      } else if (call.name === "webSearch") {
        const { query } = JSON.parse(call.function.arguments);
        const result = await webSearch(query);

        messages.push({
          role: "tool",
          tool_call_id: call.id,
          name: "webSearch",
          content: result,
        });
      }
    }
  }
};
