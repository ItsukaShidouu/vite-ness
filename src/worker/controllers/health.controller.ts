import type { Context } from "hono";
import type { AppEnv } from "../types";
import { jsonResponse } from "../lib/response";

export const getHealth = (context: Context<AppEnv>): Response => {
	return jsonResponse(
		{
			status: "ok",
			service: "vite-ness-api",
			timestamp: new Date().toISOString(),
		},
		context.get("requestId"),
	);
};
