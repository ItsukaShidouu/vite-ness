import { Hono } from "hono";
import type { AppEnv } from "../types";
import { getApiInfo } from "../controllers/info.controller";
import { healthRouter } from "./health.router";
import { downloaderRouter } from "./downloader.router";

export const mainRouter = new Hono<AppEnv>();

mainRouter.get("/", getApiInfo);
mainRouter.route("/health", healthRouter);
mainRouter.route("/", downloaderRouter);
