import type { Context } from "hono";
import type { AppEnv } from "../types";
import { jsonResponse } from "../lib/response";

export const getRootInfo = (context: Context<AppEnv>): Response => {
	return jsonResponse(
		{
			name: "BTCH Downloader API",
			version: "v1",
			documentation: "/api/v1",
		},
		context.get("requestId"),
	);
};

export const getApiInfo = (context: Context<AppEnv>): Response => {
	return jsonResponse(
		{
			name: "BTCH Downloader API",
			version: "v1",
			documentation: "/api/v1",
		},
		context.get("requestId"),
	);
};

export const getV1Info = (context: Context<AppEnv>): Response => {
	return jsonResponse(
		{
			name: "BTCH Downloader API",
			version: "v1",
			endpoints: {
				health: "/api/v1/health",
				download: {
					tiktok: "/api/v1/download/tiktok?url=...",
					instagram: "/api/v1/download/instagram?url=...",
					youtube: "/api/v1/download/youtube?url=...",
					ytsearch: "/api/v1/download/ytsearch?query=...",
					facebook: "/api/v1/download/facebook?url=...",
					twitter: "/api/v1/download/twitter?url=...",
					spotify: "/api/v1/download/spotify?url=...",
					soundcloud: "/api/v1/download/soundcloud?url=...",
					threads: "/api/v1/download/threads?url=...",
					pinterest: "/api/v1/download/pinterest?query=...",
					capcut: "/api/v1/download/capcut?url=...",
					gdrive: "/api/v1/download/gdrive?url=...",
					douyin: "/api/v1/download/douyin?url=...",
					snackvideo: "/api/v1/download/snackvideo?url=...",
					xiaohongshu: "/api/v1/download/xiaohongshu?url=...",
					kuaishou: "/api/v1/download/kuaishou?url=...",
					mediafire: "/api/v1/download/mediafire?url=...",
				},
			},
		},
		context.get("requestId"),
	);
};
