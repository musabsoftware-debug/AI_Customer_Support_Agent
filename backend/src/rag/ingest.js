import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import path from "path";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Pinecone } from "@pinecone-database/pinecone";
import { embed } from "@pinecone-database/pinecone/dist/inference";
import { OpenAI } from "openai/client.js";

const KB_Path = path.resolve("knowledgeBase");
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

const embeddings = new OpenAIEmbedding({
  model: "text-embedding-3-small",
});

export async function ingestPDFS() {
  const files = fs.readdirSync(KB_Path).filter((file) => file.endsWith(".pdf"));
  let allDocs = [];
  for (const file of files) {
    const filePath = path.join(KB_Path, file);
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();
    docs.forEach(doc =>{
        doc.metadata.source = file;
    })
    allDocs.push(...docs);
  }
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 150,
  })
  const splitsDocs = await splitter.splitDocuments(allDocs);
    await PineconeStore.fromDocuments(splitsDocs, embeddings, {
    pineconeIndex,
    namespace: "customer-support",
    });
    console.log("✅ PDFs successfully indexed into Pinecone");
}
