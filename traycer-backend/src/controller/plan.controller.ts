import { GenerateEmbeddingsServiceError, GeneratePlanServiceError } from "../exceptions/openai.exceptions";
import { QueryVectorEmbeddingsServiceError } from "../exceptions/pinecone.exceptions";
import { CreatePlanError } from "../exceptions/plan.exceptions";
import { ICreatePlanSchema } from "../routes/plan.route";
import { generateEmbeddingsService, generatePlanService } from "../service/openai.service";
import { queryVectorEmbeddingsService } from "../service/pinecone.service";

export async function createPlan(payload: ICreatePlanSchema){
    try {
        // generate embeddings for the plan
        const embeddings = await generateEmbeddingsService(payload.query);
        console.log("🚀 ~ createPlan ~ embeddings: completed")
        // query related information from the vector db
        const results = await queryVectorEmbeddingsService({
            indexName: "traycer-index",
            vector: embeddings
        })
        const context = results.matches.filter(match => match.score && match.score > 0.2).map(match => match.metadata);
        console.log("🚀 ~ createPlan ~ queryVectorEmbeddingsService: completed", JSON.stringify(context));
        // pass the context to openai along with the query to get the response
        const response = await generatePlanService({
            query: payload.query,
            tree: payload.tree,
            context: JSON.stringify(context)
        })

        // save the plan to the db

        // return the response
        return response;
    } catch (error) {
        if (error instanceof GeneratePlanServiceError || error instanceof GenerateEmbeddingsServiceError || error instanceof QueryVectorEmbeddingsServiceError) {
            throw error;
        }
        throw new CreatePlanError("Failed to create plan", { cause: (error as Error).message });
    }
}