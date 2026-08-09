import type { Context } from "hono";
import type { AppEnv } from "../types";
import { TodoService } from "../services/todo.service";

export const proxyTodoRequest = (context: Context<AppEnv>): Promise<Response> => {
	return TodoService.proxyStore(context);
};
