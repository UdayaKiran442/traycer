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


