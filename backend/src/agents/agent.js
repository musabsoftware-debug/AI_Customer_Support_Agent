import { Groq } from "groq-sdk";

// import { Travily } from "travily-sdk";

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
      model: "",
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
      if (call.nmae === "searchKnowledgeBase") {
        const { query } = JSON.parse(call.function.arguments);
        const result = await searchKb(query);

        messages.push({
            role:"tool",
            name: "searchKnowledgeBase",
            content: result,
        })
      }
    }
  }
};
