import { Hono } from "hono";
import type { AppEnv } from "./types";
import { requestContext } from "./middleware/request-context";
import { apiCors } from "./middleware/cors";
import { mainRouter } from "./routes";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

export const app = new Hono<AppEnv>();

// Global Middlewares
app.use("*", requestContext);
app.use("/api/*", apiCors);

// Routes Assembly
app.route("/", mainRouter);

// Error Handling
app.notFound(notFoundHandler);
app.onError(errorHandler);

