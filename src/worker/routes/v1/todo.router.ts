import { Hono } from "hono";
import type { AppEnv } from "../../types";
import { apiKeyGuard } from "../../middleware/api-key";
import { proxyTodoRequest } from "../../controllers/todo.controller";

export const todoRouter = new Hono<AppEnv>();

todoRouter.use("*", apiKeyGuard);
todoRouter.all("/", proxyTodoRequest);
todoRouter.all("/*", proxyTodoRequest);
