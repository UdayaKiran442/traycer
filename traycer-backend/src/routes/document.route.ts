import { Hono } from "hono";
import { z } from "zod";
import { EmbedDocumentError } from "../exceptions/document.exception";
import { GenerateEmbeddingsServiceError } from "../exceptions/openai.exceptions";
import { UpsertVectorEmbeddingsServiceError } from "../exceptions/pinecone.exceptions";

const documentRoute = new Hono();

const EmbedDocumentSchema = z.object({
    content: z.string().min(1, "Content is required"),
    uri: z.object({
        _formatted: z.string(),
        _fsPath: z.string(),
        authority: z.string(),
        fragment: z.string(),
        fsPath: z.string(),
        path: z.string(),
        query: z.string(),
        scheme: z.string(),
    })
})

export type IEmbedDocumentSchema = z.infer<typeof EmbedDocumentSchema>;

documentRoute.post('/embed', async (c) => {
    try {
        const validation = EmbedDocumentSchema.safeParse(await c.req.json());
        if (!validation.success) {
            throw validation.error;
        }

    } catch (error) {
        if(error instanceof z.ZodError){
            const errMessage = JSON.parse(error.message);
            return c.json({ success: false, error: errMessage[0], message: errMessage[0].message }, 400);
        }
        if (error instanceof GenerateEmbeddingsServiceError || error instanceof UpsertVectorEmbeddingsServiceError || error instanceof EmbedDocumentError) {
            return c.json({ success: false, error: error.message }, 500);
        }
    }
})

export default documentRoute;