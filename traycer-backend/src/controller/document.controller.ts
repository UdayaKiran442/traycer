import { EmbedDocumentError } from "../exceptions/document.exception";
import { GenerateEmbeddingsServiceError } from "../exceptions/openai.exceptions";
import { UpsertVectorEmbeddingsServiceError } from "../exceptions/pinecone.exceptions";
import { IEmbedDocumentSchema } from "../routes/document.route";
import { generateEmbeddingsService } from "../service/openai.service";
import { upsertVectorEmbeddingsService } from "../service/pinecone.service";

export async function embedDocument(payload: IEmbedDocumentSchema) {
    try {
        // convert document to vector embeddings
        const embeddings = await generateEmbeddingsService(payload.content);

        // store vector embeddings in the database
        await upsertVectorEmbeddingsService({
            indexName: "traycer-index",
            vector: embeddings,
            metadata: {
                content: payload.content,
                uri: payload.uri,
            }
        })
    } catch (error) {
        if (error instanceof GenerateEmbeddingsServiceError || error instanceof UpsertVectorEmbeddingsServiceError){
            throw error;
        }
        throw new EmbedDocumentError('Failed to embed document', { cause: (error as Error).message });
    }
}