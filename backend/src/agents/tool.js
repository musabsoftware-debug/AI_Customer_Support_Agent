export const tools = [
  {
    type: "function",
    function: {
      name: "webSearch",
      description:
        "Use this tool to search the internet for external information. Useful when the internal knowledge base does not have the answer.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The search query string for the web search.",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "searchKnowledgeBase",
      description:
        "Use this tool to search the internal knowledge base (PDFs, docs) for customer-specific information. Input should be a search query string.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "The search query string to find relevant articles in the knowledge base.",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "escalateToHuman",
      description:
        "Use this tool to escalate the conversation to a human support agent. Input should be the reason for escalation. Output will be a confirmation message.",
      parameters: {
        type: "object",
        properties: {
          reason: {
            type: "string",
          },
          required: ["reason"],
        },
      },
    },
  },
];
