import OpenAI from "openai";

import { GenerateEmbeddingsServiceError, GeneratePlanServiceError } from "../exceptions/openai.exceptions";

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

export async function generatePlanService(payload: {query: string, context: string, tree: string}) {
	try {
		const response = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			messages: [
				{
					role: "system",
					content: `
						You are expert in system design, act as a seinor software engineer who can code and design features.
						Given the user query, and the context, create a detailed plan to achieve the goal of the query.
						You will also get the current folder structure of the project.
						Use the context to create the plan, if the context is not sufficient, use your own knowledge to create the plan.
						The plan must contain:
						1. Observations from codebase.
						2. Approach taken to implement the feaature.
							2.1 Reasons for choosing the approach.
						3. Files to be added or modified based on the approach along with description on the changes.
						4. Code snippets are not important, so avoid them. Provide only if necessary based on the query and context.
						5. Context will have the relevant information from the codebase, along with the path of the file, use it to create the plan.

						Query: ${payload.query}
						Current Folder Structure: ${payload.tree}
						Context: ${payload.context}

						Return the response in JSON
						{
							"observations": string[],
							"approach": {
								"approach": string,
								"reasons": string[]
							},
							"files": {
								"filePath": string,
								"description": string,
								"type": "added" | "modified"
							}[]
						}
					`
				}
			]
		})
		return response.choices[0].message;
	} catch (error) {
		throw new GeneratePlanServiceError("Failed to generate plan", { cause: (error as Error).message });
	}
}