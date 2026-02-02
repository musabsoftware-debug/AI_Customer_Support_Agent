import { tavily } from "@tavily/core";
import dotenv from "dotenv";
dotenv.config();
const tavilyClient = tavily({
  apiKey: process.env.TAVILY_API_KEY,
});

/**
 * Search external knowledge using Tavily
 * Used when internal KB (RAG) is not enough
 */
export async function webSearch(query) {
  try {
    const response = await tavilyClient.search(query, {
      search_depth: "advanced",
      max_results: 5,
      include_answer: false,
      include_raw_content: false,
    });

    if (!response?.results?.length) {
      return "No relevant external information found.";
    }

    // Convert results into LLM-friendly text
    const formattedResults = response.results
      .map(
        (r, idx) =>
          `Result ${idx + 1}:\nTitle: ${r.title}\nContent: ${r.content}`
      )
      .join("\n\n");

    return formattedResults;
  } catch (error) {
    console.error("Tavily search error:", error.message);
    return "Error while searching external knowledge.";
  }
}
