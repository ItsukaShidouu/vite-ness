import { Hono } from "hono";
import type { AppEnv } from "../../types";
import { getV1Info } from "../../controllers/info.controller";
import { healthRouter } from "./health.router";
import { downloaderRouter } from "./downloader.router";

export const v1Router = new Hono<AppEnv>();

v1Router.get("/", getV1Info);
v1Router.route("/health", healthRouter);
v1Router.route("/download", downloaderRouter);
