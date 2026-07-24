import type { MiddlewareHandler } from "hono";
import { requestIdFrom } from "../lib/response";
import type { AppEnv } from "../types";

export const requestContext: MiddlewareHandler<AppEnv> = async (context, next) => {
	const startedAt = Date.now();
	const requestId = requestIdFrom(context.req.raw);

	context.set("startedAt", startedAt);
	context.set("requestId", requestId);

	await next();

	context.header("x-request-id", requestId);
	context.header("server-timing", `app;dur=${Date.now() - startedAt}`);
};
