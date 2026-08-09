import type { Context } from "hono";
import type { AppEnv } from "../types";
import { ApiError } from "./api-error";

export async function getTargetInput(
	context: Context<AppEnv>,
	primaryParam = "url",
): Promise<string> {
	// 1. Check URL Search Query Params (e.g. ?url=... or ?query=... or ?q=...)
	const urlValue = context.req.query(primaryParam) || context.req.query("q") || context.req.query("url") || context.req.query("query");
	if (urlValue && urlValue.trim().length > 0) {
		return urlValue.trim();
	}

	// 2. Check JSON Body for POST/PUT/PATCH requests
	if (["POST", "PUT", "PATCH"].includes(context.req.method)) {
		try {
			const body = (await context.req.json()) as Record<string, unknown>;
			if (body && typeof body === "object") {
				const val = body[primaryParam] ?? body.q ?? body.url ?? body.query;
				if (typeof val === "string" && val.trim().length > 0) {
					return val.trim();
				}
			}
		} catch {
			// If JSON body parsing fails, proceed to throw error below
		}
	}

	throw new ApiError(
		400,
		"BAD_REQUEST",
		`Parameter '${primaryParam}' tidak boleh kosong. Sertakan melalui query URL (?${primaryParam}=...) atau body JSON.`,
	);
}
