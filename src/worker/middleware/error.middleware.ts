import type { ErrorHandler, NotFoundHandler } from "hono";
import type { AppEnv } from "../types";
import { ApiError, isApiError } from "../lib/api-error";
import { errorResponse } from "../lib/response";

export const notFoundHandler: NotFoundHandler<AppEnv> = (context) => {
	return errorResponse(
		new ApiError(404, "NOT_FOUND", "Endpoint tidak ditemukan."),
		context.get("requestId"),
	);
};

export const errorHandler: ErrorHandler<AppEnv> = (error, context) => {
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
};
