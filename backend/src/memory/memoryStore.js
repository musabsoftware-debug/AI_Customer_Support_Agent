import NodeCache from "node-cache";

export const memoryStore = new NodeCache({ stdTTL: 3600, checkperiod: 120 }); // Cache with 1 hour TTL and check period of 2 minutes

export function getMemory(threadId, basePrompt) {
  return memoryStore.get(`${threadId}`) ?? [...basePrompt];
}

export function saveMemory(threadId, messages) {
  memoryStore.set(threadId, messages);
}
