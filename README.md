# Backend Internship Assignment — Quote Management Service

Node.js + TypeScript backend that manages quote requests and integrates with a FastAPI document-analysis service.

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express
- **ORM:** Prisma
- **Database:** SQLite (chosen over Postgres for fast local setup within the assignment's time box — see note below)
- **Dev tooling:** ts-node-dev

## Project Structure

```
src/
  controllers/    → parses requests, calls services, shapes responses
  routes/         → route → controller wiring
  services/       → business logic, FastAPI orchestration, validation rules
  repositories/   → only layer that talks to Prisma/the database
  middleware/      → request validation, centralized error handling
  utils/          → FastAPI client wrapper, custom AppError class, Prisma client singleton
prisma/
  schema.prisma   → QuoteRequest and AnalysisResult models
```

## Setup

```bash
npm install
npx prisma migrate dev --name init
npm run dev
```

Server runs on `http://localhost:3000`.

`.env` requires:
```
DATABASE_URL="file:./dev.db"
```

## Database Design

**QuoteRequest** — id, customer, project, status, estimated_value, created_date

**AnalysisResult** — id, quote_id (FK), risk, confidence, missing_items, analyzed_at

Relation is one-to-many: a quote can be re-analyzed multiple times, and every analysis is kept rather than overwritten, so there's a history of how risk changed as more information came in.

> **Note on `missing_items`:** SQLite has no native array column type, so this field is stored as a JSON string (`JSON.stringify`/`JSON.parse` on write/read) rather than a real array. This would be a native `String[]` if running on Postgres.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/quotes` | Returns all quotes with their analysis history |
| GET | `/quotes/:id` | Returns a single quote with its analyses, 404 if not found |
| POST | `/quotes` | Creates a new quote. Validates customer, project, and estimated_value |
| POST | `/quotes/:id/analyze` | Finds the quote, calls the FastAPI service, saves the result, returns combined response |
| PATCH | `/quotes/:id/status` | Updates status. Only accepts: `New`, `In Review`, `Needs Info`, `Completed` |

## FastAPI Integration

The FastAPI `/analyze` service is **mocked** (per the assignment's note that this is acceptable) in `src/utils/fastApiClient.ts`. In production this would be a real HTTP call to the FastAPI service; the mock returns a fixed `{ risk, missing_items, confidence }` shape so the rest of the pipeline (save → combine → respond) is fully real and testable.

## Error Handling

Centralized in `middleware/errorHandler.ts` via a custom `AppError` class, so every error path — validation failures, not-found, FastAPI unavailable — returns a consistent JSON shape: `{ "error": "message" }` with the appropriate status code.

| Scenario | Status |
|---|---|
| Missing customer/project, negative estimated_value | 400 |
| Invalid status value on PATCH | 400 |
| Quote not found | 404 |
| FastAPI call fails | 503 |

## Testing

All endpoints manually tested in Postman, covering both success and failure paths (validation errors, 404s, FastAPI-unavailable simulation). See `postman_collection.json` in this repo and the API screenshots included in the submission.

### Postman Collection

The full set of test requests (success and failure cases for every endpoint) is exported as `postman_collection.json` in the repo root.

**To import:**
1. Open Postman
2. Click **Import** (top left)
3. Select `postman_collection.json`
4. The "Backend Assignment" collection will appear in your sidebar with all requests ready to run

Make sure the server is running on `http://localhost:3000` first, and that at least one quote exists in the database (run the "POST quotes - success" request first) before testing the `:id`-based endpoints, since they need a real id from your database.

## What I'd Improve With More Time

- Background job queue (e.g. BullMQ) for the `/analyze` call instead of handling it synchronously, so slow FastAPI responses don't block the request
- Pagination and search on `GET /quotes`
- Optimistic locking (version column) to handle concurrent status updates safely
- Automated tests instead of manual Postman testing