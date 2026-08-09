import { Hono } from "hono";
import type { AppEnv } from "../../types";
import { getHealth } from "../../controllers/health.controller";

export const healthRouter = new Hono<AppEnv>();

healthRouter.get("/", getHealth);
