CREATE TABLE "plan" (
	"plan_id" varchar PRIMARY KEY NOT NULL,
	"query" varchar NOT NULL,
	"response" json NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
