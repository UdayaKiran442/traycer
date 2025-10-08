import OpenAI from "openai";

import { GenerateEmbeddingsServiceError, GeneratePlanServiceError } from "../exceptions/openai.exceptions";
import { cleanLLMResponse } from "../utils/cleanLLMResponse.utils";

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

						You are an experienced **Senior Software Engineer** and **System Design Expert**. Think like a top 1% engineer with vast experience in building scalable systems. Your task is to create a **clear, structured implementation plan** for the user's request.

### 📝 Instructions
1. Prioritize context first, then folder structure, then your knowledge.
2. Do not just suggest quick fixes. If there is a **more maintainable or scalable approach** (such as but not limited to extracting code into new files, adding UI components, other refactoring stuff which is more maintainable and followed by top 1% engineers), **propose that approach first**.
3. Be explicit about folder or file structure changes when suggesting new groups or modules.
4. Provide reasoning for each recommendation so the user understands why it’s better.


You will receive:
- **Query**: the feature or goal the user wants to achieve.
- **Context**: relevant code snippets or file contents from the existing codebase (with file paths).
- **Current Folder Structure**: a tree-like representation of the project's file structure.

### 📝 Instructions
1. **Prioritize context first** (use it to understand the project’s setup).
2. If the context is insufficient, use your general knowledge to fill in gaps — but always align with the provided folder structure.
3. **Do not provide full code snippets** unless absolutely necessary.
4. Be **concise, technical, and organized**. No fluff.

### 📄 Output Format
Your response must have the following sections:

1. **Observations from the Codebase**
   - Summarize relevant points from the context and folder structure.
2. **Proposed Approach**
   - A step-by-step outline of the approach to achieve the goal.
   - Explain *why* you chose this approach (e.g., framework compatibility, scalability).
3. **Files to Add or Modify**
   - For each file, list:
     - **File path**
     - **Action**: (Add / Modify)
     - **Description**: what will be changed or added and why.
4. **Additional Notes**
   - Any dependencies, constraints, or assumptions.

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
			],
			temperature: 1,
		})
		const llmContent = cleanLLMResponse(response.choices[0].message.content ?? "");
		return JSON.parse(llmContent);
	} catch (error) {
		throw new GeneratePlanServiceError("Failed to generate plan", { cause: (error as Error).message });
	}
}