export const tools = [
  {
    type: "function",
    function: {
      name: "searchKnowledgeBase",
      description:
        "Use this tool to search the knowledge base for articles related to customer queries. Input should be a search query string. Output will be a list of relevant articles.",
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
