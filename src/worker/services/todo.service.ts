import type { Context } from "hono";
import type { AppEnv } from "../types";

export class TodoService {
	static async proxyStore(context: Context<AppEnv>): Promise<Response> {
		const headers = new Headers(context.req.raw.headers);
		headers.set("x-request-id", context.get("requestId"));

		const request = new Request(context.req.raw, { headers });
		const id = context.env.TODO_STORE.idFromName("default");

		return context.env.TODO_STORE.get(id).fetch(request);
	}
}
