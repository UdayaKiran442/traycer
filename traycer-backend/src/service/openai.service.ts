import OpenAI from "openai";

import { GenerateEmbeddingsServiceError } from "../exceptions/openai.exceptions";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function generateEmbeddingsService(text: string) {
	try {
		const embeddings = await openai.embeddings.create({
			model: "text-embedding-3-large",
			input: text,
		});
		return embeddings.data[0].embedding;
	} catch (error) {
		throw new GenerateEmbeddingsServiceError("Failed to generate embeddings", { cause: (error as Error).message });
	}
}