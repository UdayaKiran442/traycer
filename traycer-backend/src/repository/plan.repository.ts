import { CreatePlanInDBError } from "../exceptions/plan.exceptions";
import db from "./db"
import { plan } from "./schema";

export async function createPlanInDB(payload: {query: string, response: {}}){
    try {
        const insertPayload = {
            planId: crypto.randomUUID(),
            query: payload.query,
            response: payload.response,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        await db.insert(plan).values(insertPayload);
    } catch (error) {
        throw new CreatePlanInDBError("Failed to create plan in DB", { cause: (error as Error).message });
    }
}