import { DurableObject } from "cloudflare:workers";
import { Hono } from "hono";
import { ApiError, isApiError } from "../lib/api-error";
import {
	errorResponse,
	jsonResponse,
	noContentResponse,
	requestIdFrom,
	serializeTodo,
} from "../lib/response";
import {
	parseCreateTodo,
	parseTodoId,
	parseTodoListQuery,
	parseUpdateTodo,
} from "../lib/validation";
import type { Bindings, Todo } from "../types";

type TodoRow = {
	id: string;
	title: string;
	description: string | null;
	completed: number;
	created_at: string;
	updated_at: string;
};

type CountRow = {
	total: number;
};

/**
 * A SQLite-backed Durable Object. It owns the data for the sample todo
 * resource, so data survives Worker isolate restarts and local development.
 */
export class TodoStore extends DurableObject<Bindings> {
	private readonly app: Hono;

	constructor(ctx: DurableObjectState, env: Bindings) {
		super(ctx, env);

		this.ctx.storage.sql.exec(`
			CREATE TABLE IF NOT EXISTS todos (
				id TEXT PRIMARY KEY,
				title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 200),
				description TEXT,
				completed INTEGER NOT NULL DEFAULT 0 CHECK (completed IN (0, 1)),
				created_at TEXT NOT NULL,
				updated_at TEXT NOT NULL
			)
		`);
		this.ctx.storage.sql.exec(
			"CREATE INDEX IF NOT EXISTS todos_created_at_idx ON todos (created_at DESC)",
		);

		this.app = new Hono();
		this.app.get("/api/v1/todos", (context) => this.list(context.req.raw));
		this.app.post("/api/v1/todos", (context) => this.create(context.req.raw));
		this.app.get("/api/v1/todos/:id", (context) =>
			this.get(context.req.raw, context.req.param("id")),
		);
		this.app.patch("/api/v1/todos/:id", (context) =>
			this.update(context.req.raw, context.req.param("id")),
		);
		this.app.delete("/api/v1/todos/:id", (context) =>
			this.remove(context.req.raw, context.req.param("id")),
		);
		this.app.notFound((context) =>
			errorResponse(
				new ApiError(404, "NOT_FOUND", "Endpoint tidak ditemukan."),
				requestIdFrom(context.req.raw),
			),
		);
		this.app.onError((error, context) => {
			const requestId = requestIdFrom(context.req.raw);

			if (!isApiError(error)) {
				console.error("todo-store request failed", {
					requestId,
					path: context.req.path,
					error,
				});
			}

			return errorResponse(
				isApiError(error)
					? error
					: new ApiError(500, "INTERNAL_ERROR", "Terjadi kesalahan pada server."),
				requestId,
			);
		});
	}

	fetch(request: Request): Response | Promise<Response> {
		return this.app.fetch(request);
	}

	private list(request: Request): Response {
		const requestId = requestIdFrom(request);
		const { page, limit, completed } = parseTodoListQuery(new URL(request.url));
		const offset = (page - 1) * limit;

		const rows =
			completed === undefined
				? this.ctx.storage.sql
						.exec<TodoRow>(
							"SELECT id, title, description, completed, created_at, updated_at FROM todos ORDER BY created_at DESC LIMIT ? OFFSET ?",
							limit,
							offset,
						)
						.toArray()
				: this.ctx.storage.sql
						.exec<TodoRow>(
							"SELECT id, title, description, completed, created_at, updated_at FROM todos WHERE completed = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
							completed ? 1 : 0,
							limit,
							offset,
						)
						.toArray();

		const count =
			completed === undefined
				? this.ctx.storage.sql.exec<CountRow>("SELECT COUNT(*) AS total FROM todos").one()
				: this.ctx.storage.sql
						.exec<CountRow>("SELECT COUNT(*) AS total FROM todos WHERE completed = ?", completed ? 1 : 0)
						.one();

		return jsonResponse(
			rows.map(serializeTodo),
			requestId,
			200,
			{
				page,
				limit,
				total: count.total,
				totalPages: Math.ceil(count.total / limit),
			},
		);
	}

	private async create(request: Request): Promise<Response> {
		const requestId = requestIdFrom(request);
		const input = await parseCreateTodo(request);
		const now = new Date().toISOString();
		const todo: Todo = {
			id: crypto.randomUUID(),
			title: input.title,
			description: input.description ?? null,
			completed: input.completed ?? false,
			createdAt: now,
			updatedAt: now,
		};

		this.ctx.storage.sql.exec(
			"INSERT INTO todos (id, title, description, completed, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
			todo.id,
			todo.title,
			todo.description,
			todo.completed ? 1 : 0,
			todo.createdAt,
			todo.updatedAt,
		);

		return jsonResponse(todo, requestId, 201);
	}

	private get(request: Request, rawId: string): Response {
		const requestId = requestIdFrom(request);
		const todo = this.findTodo(parseTodoId(rawId));

		if (!todo) {
			throw new ApiError(404, "TODO_NOT_FOUND", "Todo tidak ditemukan.");
		}

		return jsonResponse(serializeTodo(todo), requestId);
	}

	private async update(request: Request, rawId: string): Promise<Response> {
		const requestId = requestIdFrom(request);
		const id = parseTodoId(rawId);
		const input = await parseUpdateTodo(request);
		const current = this.findTodo(id);

		if (!current) {
			throw new ApiError(404, "TODO_NOT_FOUND", "Todo tidak ditemukan.");
		}

		const updatedAt = new Date().toISOString();
		const title = input.title ?? current.title;
		const description = input.description === undefined ? current.description : input.description;
		const completed = input.completed === undefined ? current.completed === 1 : input.completed;

		this.ctx.storage.sql.exec(
			"UPDATE todos SET title = ?, description = ?, completed = ?, updated_at = ? WHERE id = ?",
			title,
			description,
			completed ? 1 : 0,
			updatedAt,
			id,
		);

		const updated = this.findTodo(id);

		if (!updated) {
			throw new ApiError(500, "INTERNAL_ERROR", "Todo gagal diperbarui.");
		}

		return jsonResponse(serializeTodo(updated), requestId);
	}

	private remove(request: Request, rawId: string): Response {
		const requestId = requestIdFrom(request);
		const id = parseTodoId(rawId);
		const result = this.ctx.storage.sql.exec("DELETE FROM todos WHERE id = ?", id);

		if (result.rowsWritten === 0) {
			throw new ApiError(404, "TODO_NOT_FOUND", "Todo tidak ditemukan.");
		}

		return noContentResponse(requestId);
	}

	private findTodo(id: string): TodoRow | undefined {
		const rows = this.ctx.storage.sql
			.exec<TodoRow>(
				"SELECT id, title, description, completed, created_at, updated_at FROM todos WHERE id = ?",
				id,
			)
			.toArray();

		return rows[0];
	}
}
