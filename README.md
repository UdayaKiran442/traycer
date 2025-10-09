# Traycer mini version - System Design

**Author** - Udaya Kiran Gonuguntla \
**Date** - 8 Oct 2025

- This document describes production ready design for quiz application.
- It covers schema, API's, run time flow, scaling, security etc.

# About Traycer
- Traycer transforms ideas into project wide changes.
- It acts as a bridge between client and AI Agents like cursor, windsurf, claude code, codex etc.
- Helps to boost coding agents performance by **5X**.

## Workflows offered by Traycer
- Plan Workflow - Plans detailed task to do before sending it to agent.
- Phases Workflow - Breaks down tasks to be achieved in phases or steps.
- Review Workflow - Reviews the written code and suggest few cases to handle if any.

# Workflow or feature chosen for development of mini traycer
**Plan Workflow** is chosen to develop.

## About Plan Workflow
- Before executing the task, it plans the details of the task to be achieved.
- Direct step by step task for straight forward features.
- User will type the query, pass optional context such as files etc and traycer will give detailed plan on how to completed the task and this can be passed to any coding agent.

# Technology Stack

## Backend
- Runtime Environment: Bun - chosen for its speed, light weight runtime.
- Routing: HonoJS - Web application high-performance framework for Bun/Deno/Cloudflare workers that simplifies route handling, request validation.
- Database: PostgreSQL - SQL database for storing quiz/questions/submissions/reports data.
- Database hosting: Neon - serverless postgres provider with branching, auto-scaling.
- ORM/Query Builder: Drizzle ORM - type-safe schema definitions, migrations and SQL query building.

## Extension
- Programming Language: TypeScript.
- Extension Framework: Visual Studio Code (VS Code) Extension API.

# High Level System Design

## 1. Objective

To build an AI-powered plan generator feature that scans a given project (e.g., Hono-based app), and generates a structured “Plan” for the user query consisting of:
- Observations – key findings from code analysis.
- Approach – recommended solution or architecture pattern.
- Files – changes needed in specific files.

## 2. Data Flow

Client → Workspace Analyzer Command → Plan Generator Command (LLM) → Persistence → Client UI

1. Users input query, basically a asks for a plan to develop the feature.
2. Query will be sent to backend along with current folder structure of the project.
3. Response will be generated from backend and displayed in the UI.  
4. Plan stored in DB and displayed to user.

# Low Level System Design

## API Design
**Base URL**: http://localhost:3000/

### Embed document

API End Point: /document/embed

Method: POST

Description: This end point is used to store the entire codebase in embeddings form in vector db.

Flow:
- VS code extension API is used to fetch all the files along with their content and file path.
- File content and path are stored in object and will be passed to backend api.
- Then the content will be converted to embeddings and then will be stored in vector db along with metadata.
- Metadata contains content in the file and the filepath.
- Hence with help of this API entire code base is stored as vector embeddings in vector db and will be later fetched by plan route for providing context to LLM.

Payload:
```ts
{
  content: string,
  uri: {
    path: string
  }
}
```

Response:
```ts
{
  success: boolean,
  message: string
}
```

### Create Plan

API End Point: /plan/create

Method: POST

Description: This end point is used to generate plan for user query. For example if user queried to add routes in the project api gives a detailed plan about the approach.

Flow:
- User query will be converted to embeddings.
- Then the embeddings will be used to get relavant context about codebase from vector db.
- Context along with user query and current project folder structure will be passed to LLM for generating detailed plan.



Payload:
```ts
{
  query: string,
  tree: string
}
```

Response:
```ts
{
  success: boolean,
  message: string,
  data: {
    observations: string[],
    approach: {}, // approach taken and reasoning for the approach.
    files: {}[] // contains filePath, description, whether the file is added newly or modified
  }
}
```

Sample Payload:
```sh
{
    "query": "How add JWT authentication and middleware for routes to allow only authenticated users to access the resource",
    "tree": "{'src':{'index.ts':null},'package.json':null}"
}
```

Sample Response:
```sh
{
    "success": true,
    "message": "Plan created successfully",
    "data": {
        "observations": [
            "The project uses Hono, a minimal web framework for TypeScript.",
            "Currently, there is only one route defined, which serves a text response.",
            "There is no clear structure for handling authentication or user access control.",
            "The folder structure is minimal, indicating it may still be in early development."
        ],
        "approach": {
            "approach": "Implement JWT authentication and a middleware for authentication checks on routes.",
            "reasons": [
                "JWT is a stateless authentication mechanism, making it suitable for RESTful APIs.",
                "Middleware allows for centralized control over route access, enhancing maintainability.",
                "This approach paves the way for scalability, as new routes can easily incorporate the authentication middleware."
            ]
        },
        "files": [
            {
                "filePath": "src/middleware/auth.ts",
                "action": "add",
                "description": "Create a middleware function that validates JWT tokens on incoming requests, rejecting unauthorized users.",
                "type": "added"
            },
            {
                "filePath": "src/routes/auth.ts",
                "action": "add",
                "description": "Create a new route module dedicated to authentication endpoints (e.g., login, registration). This keeps auth-related routes organized and scalable.",
                "type": "added"
            },
            {
                "filePath": "src/index.ts",
                "action": "modify",
                "description": "Modify the main application file to integrate the new middleware and route module. This will enable protected routes within the app.",
                "type": "modified"
            },
            {
                "filePath": "package.json",
                "action": "modify",
                "description": "Add dependencies for JSON Web Token (jwt-simple or jsonwebtoken) to handle JWT creation and verification.",
                "type": "modified"
            }
        ]
    }
}
```

