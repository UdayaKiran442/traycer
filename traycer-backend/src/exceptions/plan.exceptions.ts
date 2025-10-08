export class CreatePlanError extends Error {
    public cause?: unknown;
    constructor(message: string, options?: { cause?: unknown }) {
        super(message);
        this.name = "CreatePlanError";
        if (options?.cause) this.cause = options.cause;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class CreatePlanInDBError extends Error {
    public cause?: unknown;
    constructor(message: string, options?: { cause?: unknown }) {
        super(message);
        this.name = "CreatePlanInDBError";
        if (options?.cause) this.cause = options.cause;
        Error.captureStackTrace(this, this.constructor);
    }
}