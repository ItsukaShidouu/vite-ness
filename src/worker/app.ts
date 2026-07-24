import { Hono } from "hono";
import type { Context } from "hono";
import { ApiError, isApiError } from "./lib/api-error";
import { errorResponse, jsonResponse } from "./lib/response";
import { apiKeyGuard } from "./middleware/api-key";
import { apiCors } from "./middleware/cors";
import { requestContext } from "./middleware/request-context";
import type { AppEnv } from "./types";

export const app = new Hono<AppEnv>();

app.use("*", requestContext);
app.use("/api/*", apiCors);

app.get("/", (context) =>
	jsonResponse(
		{
			name: "vite-ness API",
			version: "v1",
			documentation: "/api/v1",
		},
		context.get("requestId"),
	),
);

app.get("/api", (context) =>
	jsonResponse(
		{
			version: "v1",
			documentation: "/api/v1",
		},
		context.get("requestId"),
	),
);

app.get("/api/v1", (context) =>
	jsonResponse(
		{
			name: "vite-ness API",
			version: "v1",
			resources: {
				health: "/api/v1/health",
				todos: "/api/v1/todos",
			},
		},
		context.get("requestId"),
	),
);

app.get("/api/v1/health", (context) =>
	jsonResponse(
		{
			status: "ok",
			service: "vite-ness-api",
			timestamp: new Date().toISOString(),
		},
		context.get("requestId"),
	),
);

app.use("/api/v1/todos", apiKeyGuard);
app.use("/api/v1/todos/*", apiKeyGuard);
app.all("/api/v1/todos", proxyTodoStore);
app.all("/api/v1/todos/*", proxyTodoStore);

app.notFound((context) =>
	errorResponse(
		new ApiError(404, "NOT_FOUND", "Endpoint tidak ditemukan."),
		context.get("requestId"),
	),
);

app.onError((error, context) => {
	if (!isApiError(error)) {
		console.error("api request failed", {
			requestId: context.get("requestId"),
			path: context.req.path,
			error,
		});
	}

	return errorResponse(
		isApiError(error)
			? error
			: new ApiError(500, "INTERNAL_ERROR", "Terjadi kesalahan pada server."),
		context.get("requestId"),
	);
});

function proxyTodoStore(context: Context<AppEnv>): Promise<Response> {
	const headers = new Headers(context.req.raw.headers);
	headers.set("x-request-id", context.get("requestId"));

	const request = new Request(context.req.raw, { headers });
	const id = context.env.TODO_STORE.idFromName("default");

	return context.env.TODO_STORE.get(id).fetch(request);
}
