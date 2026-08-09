import type { Context } from "hono";
import type { AppEnv } from "../types";
import { jsonResponse } from "../lib/response";

export const getApiInfo = (context: Context<AppEnv>): Response => {
	return jsonResponse(
		{
			name: "BTCH Downloader API",
			status: "online",
			endpoints: {
				health: "/health",
				downloader: {
					tiktok: "/tiktok?url=...",
					instagram: "/instagram?url=...",
					youtube: "/youtube?url=...",
					ytsearch: "/ytsearch?query=...",
					facebook: "/facebook?url=...",
					twitter: "/twitter?url=...",
					spotify: "/spotify?url=...",
					soundcloud: "/soundcloud?url=...",
					threads: "/threads?url=...",
					pinterest: "/pinterest?query=...",
					capcut: "/capcut?url=...",
					gdrive: "/gdrive?url=...",
					douyin: "/douyin?url=...",
					snackvideo: "/snackvideo?url=...",
					xiaohongshu: "/xiaohongshu?url=...",
					kuaishou: "/kuaishou?url=...",
					mediafire: "/mediafire?url=...",
				},
			},
		},
		context.get("requestId"),
	);
};
