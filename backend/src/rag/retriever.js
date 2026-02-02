import "dotenv/config";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const pineconeIndex = pinecone.index(process.env.PINECONE_INDEX_NAME);

const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  pineconeIndex,
  namespace: "customer-support",
});

export async function searchKnowledgeBase(query) {
  const retriever = vectorStore.asRetriever({
    k: 5,
  });

  const docs = await retriever.getRelevantDocuments(query);

  if (!docs.length) {
    return "No relevant internal documents found.";
  }

  return `
Use the following internal company documents to answer the customer:

${docs
  .map(
    (doc, i) => `Source ${i + 1} (${doc.metadata.source}):\n${doc.pageContent}`,
  )
  .join("\n\n")}

If the answer is not present, say you don't know.
`;
}
