import { Pinecone } from '@pinecone-database/pinecone'


import { UpsertVectorEmbeddingsServiceError } from "../exceptions/pinecone.exceptions";


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
        throw new UpsertVectorEmbeddingsServiceError('Failed to upsert vector embeddings', { cause: (error as Error).message });
    }
}
