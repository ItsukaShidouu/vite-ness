import type { MiddlewareHandler } from "hono";
import { ApiError } from "../lib/api-error";
import type { AppEnv } from "../types";

/**
 * Authentication is opt-in: set the API_KEY Worker secret to require
 * `Authorization: Bearer <API_KEY>` for mutable sample-resource routes.
 */
export const apiKeyGuard: MiddlewareHandler<AppEnv> = async (context, next) => {
	const apiKey = context.env.API_KEY;

	if (!apiKey) {
		await next();
		return;
	}

	if (context.req.header("authorization") !== `Bearer ${apiKey}`) {
		throw new ApiError(401, "UNAUTHORIZED", "Bearer token tidak valid atau tidak ada.");
	}

	await next();
};
