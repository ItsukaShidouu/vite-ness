import type { Context } from "hono";
import type { AppEnv } from "../types";
import { jsonResponse } from "../lib/response";

export const getRootInfo = (context: Context<AppEnv>): Response => {
	return jsonResponse(
		{
			name: "vite-ness API",
			version: "v1",
			documentation: "/api/v1",
		},
		context.get("requestId"),
	);
};

export const getApiInfo = (context: Context<AppEnv>): Response => {
	return jsonResponse(
		{
			version: "v1",
			documentation: "/api/v1",
		},
		context.get("requestId"),
	);
};

export const getV1Info = (context: Context<AppEnv>): Response => {
	return jsonResponse(
		{
			name: "vite-ness API",
			version: "v1",
			resources: {
				health: "/api/v1/health",
				todos: "/api/v1/todos",
			},
		},
		context.get("requestId"),
	);
};
