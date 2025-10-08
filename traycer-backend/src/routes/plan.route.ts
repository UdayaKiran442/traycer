import { Hono } from "hono";
import z from "zod";
import { createPlan } from "../controller/plan.controller";
import { GenerateEmbeddingsServiceError, GeneratePlanServiceError } from "../exceptions/openai.exceptions";
import { QueryVectorEmbeddingsServiceError } from "../exceptions/pinecone.exceptions";

const planRoute = new Hono();

const CreatePlanSchema = z.object({
    query: z.string().min(1, "Query is required"),
    tree: z.string().min(1, "Tree is required"),
})

export type ICreatePlanSchema = z.infer<typeof CreatePlanSchema>;

planRoute.post('/create', async (c) => {
    try {
        const validation = CreatePlanSchema.safeParse(await c.req.json());
        if (!validation.success) {
            throw validation.error;
        }
        // Call your service to create the plan here
        const context = await createPlan(validation.data);
        return c.json({ success: true, message: "Plan created successfully", data: context }, 200);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errMessage = JSON.parse(error.message);
            return c.json({ success: false, error: errMessage[0], message: errMessage[0].message }, 400);
        }

        if (error instanceof GeneratePlanServiceError || error instanceof GenerateEmbeddingsServiceError || error instanceof QueryVectorEmbeddingsServiceError) {
            return c.json({ success: false, error: error.name, message: error.message, cause: error.cause }, 500);
        }

        return c.json({ success: false, error: 'Internal Server Error', message: 'Internal Server Error' }, 500);
    }
})

export default planRoute;