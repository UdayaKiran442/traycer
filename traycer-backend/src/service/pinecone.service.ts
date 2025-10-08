import { Pinecone } from '@pinecone-database/pinecone'


import { QueryVectorEmbeddingsServiceError, UpsertVectorEmbeddingsServiceError } from "../exceptions/pinecone.exceptions";


const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY ?? "",
})

export async function upsertVectorEmbeddingsService(payload: { indexName: string, vector: number[], metadata: any }) {
    try {
        const index = pinecone.index(payload.indexName)
        await index.upsert([
            {
                id: crypto.randomUUID(),
                values: payload.vector,
                metadata: payload.metadata,
            }
        ])
    } catch (error) {
        console.log("🚀 ~ upsertVectorEmbeddingsService ~ error:", error)
        throw new UpsertVectorEmbeddingsServiceError('Failed to upsert vector embeddings', { cause: (error as Error).message });
    }
}

export async function queryVectorEmbeddingsService(payload: { indexName: string, vector: number[] }) {
    try {
        const index = pinecone.index(payload.indexName)
        // fetch similar records for match score above 0.2
        return await index.query({
            vector: payload.vector,
            includeMetadata: true,
            topK: 10,
        })
    } catch (error) {
        throw new QueryVectorEmbeddingsServiceError('Failed to query vector embeddings', { cause: (error as Error).message });
    }
}