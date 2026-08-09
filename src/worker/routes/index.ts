import { Hono } from "hono";
import type { AppEnv } from "../types";
import { getRootInfo, getApiInfo } from "../controllers/info.controller";
import { v1Router } from "./v1";

export const mainRouter = new Hono<AppEnv>();

mainRouter.get("/", getRootInfo);
mainRouter.get("/api", getApiInfo);
mainRouter.route("/api/v1", v1Router);
