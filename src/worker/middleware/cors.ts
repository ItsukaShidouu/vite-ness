import { cors } from "hono/cors";

export const apiCors = cors({
	origin: (origin, context) => {
		const configuredOrigins = (context.env.CORS_ORIGIN ?? "*")
			.split(",")
			.map((value: string) => value.trim())
			.filter(Boolean);

		if (configuredOrigins.includes("*")) {
			return "*";
		}

		return configuredOrigins.includes(origin) ? origin : null;
	},
	allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
	allowHeaders: ["Authorization", "Content-Type", "X-Request-Id"],
	exposeHeaders: ["Server-Timing", "X-Request-Id"],
	maxAge: 86_400,
});
