import type { Context } from "hono";
import type { AppEnv } from "../types";
import { ApiError } from "./api-error";

export async function getTargetInput(
	context: Context<AppEnv>,
	primaryParam = "url",
): Promise<string> {
	// 1. Check URL Search Query Params (for GET requests and query-based requests)
	const query = context.req.query();
	
	const queryVal =
		query[primaryParam] ||
		query.url ||
		query.q ||
		query.query ||
		query.link ||
		query.target ||
		query.src;

	if (queryVal && queryVal.trim().length > 0) {
		return queryVal.trim();
	}

	// Handle edge case where URL was passed without value, e.g. ?https://tiktok.com/...
	const queryKeys = Object.keys(query);
	for (const key of queryKeys) {
		if (key.startsWith("http://") || key.startsWith("https://")) {
			return key.trim();
		}
	}

	// 2. Check Body for POST/PUT/PATCH requests
	if (["POST", "PUT", "PATCH"].includes(context.req.method)) {
		try {
			const body = (await context.req.json()) as Record<string, unknown>;
			if (body && typeof body === "object") {
				const val =
					body[primaryParam] ??
					body.url ??
					body.q ??
					body.query ??
					body.link ??
					body.target;
				if (typeof val === "string" && val.trim().length > 0) {
					return val.trim();
				}
			}
		} catch {
			try {
				const formData = await context.req.formData();
				const val =
					formData.get(primaryParam) ||
					formData.get("url") ||
					formData.get("q") ||
					formData.get("query") ||
					formData.get("link");
				if (typeof val === "string" && val.trim().length > 0) {
					return val.trim();
				}
			} catch {
				// Ignore
			}
		}
	}

	throw new ApiError(
		400,
		"BAD_REQUEST",
		`Parameter '${primaryParam}' tidak boleh kosong. Silakan gunakan metode GET dengan query param (?${primaryParam}=...) atau metode POST dengan body JSON.`,
	);
}
