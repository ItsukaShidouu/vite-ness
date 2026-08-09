import type { Context } from "hono";
import type { AppEnv } from "../types";
import { jsonResponse } from "../lib/response";
import { getTargetInput } from "../lib/input-helper";
import { DownloaderService } from "../services/downloader.service";

export const downloadTiktok = async (context: Context<AppEnv>): Promise<Response> => {
	const url = await getTargetInput(context, "url");
	const data = await DownloaderService.tiktok(url);
	return jsonResponse(data, context.get("requestId"));
};

export const downloadInstagram = async (context: Context<AppEnv>): Promise<Response> => {
	const url = await getTargetInput(context, "url");
	const data = await DownloaderService.instagram(url);
	return jsonResponse(data, context.get("requestId"));
};

export const downloadYoutube = async (context: Context<AppEnv>): Promise<Response> => {
	const url = await getTargetInput(context, "url");
	const data = await DownloaderService.youtube(url);
	return jsonResponse(data, context.get("requestId"));
};

export const searchYoutube = async (context: Context<AppEnv>): Promise<Response> => {
	const query = await getTargetInput(context, "query");
	const data = await DownloaderService.youtubeSearch(query);
	return jsonResponse(data, context.get("requestId"));
};

export const downloadFacebook = async (context: Context<AppEnv>): Promise<Response> => {
	const url = await getTargetInput(context, "url");
	const data = await DownloaderService.facebook(url);
	return jsonResponse(data, context.get("requestId"));
};

export const downloadTwitter = async (context: Context<AppEnv>): Promise<Response> => {
	const url = await getTargetInput(context, "url");
	const data = await DownloaderService.twitter(url);
	return jsonResponse(data, context.get("requestId"));
};

export const downloadSpotify = async (context: Context<AppEnv>): Promise<Response> => {
	const url = await getTargetInput(context, "url");
	const data = await DownloaderService.spotify(url);
	return jsonResponse(data, context.get("requestId"));
};

export const downloadSoundcloud = async (context: Context<AppEnv>): Promise<Response> => {
	const url = await getTargetInput(context, "url");
	const data = await DownloaderService.soundcloud(url);
	return jsonResponse(data, context.get("requestId"));
};

export const downloadThreads = async (context: Context<AppEnv>): Promise<Response> => {
	const url = await getTargetInput(context, "url");
	const data = await DownloaderService.threads(url);
	return jsonResponse(data, context.get("requestId"));
};

export const downloadPinterest = async (context: Context<AppEnv>): Promise<Response> => {
	const query = await getTargetInput(context, "query");
	const data = await DownloaderService.pinterest(query);
	return jsonResponse(data, context.get("requestId"));
};

export const downloadCapcut = async (context: Context<AppEnv>): Promise<Response> => {
	const url = await getTargetInput(context, "url");
	const data = await DownloaderService.capcut(url);
	return jsonResponse(data, context.get("requestId"));
};

export const downloadGdrive = async (context: Context<AppEnv>): Promise<Response> => {
	const url = await getTargetInput(context, "url");
	const data = await DownloaderService.gdrive(url);
	return jsonResponse(data, context.get("requestId"));
};

export const downloadDouyin = async (context: Context<AppEnv>): Promise<Response> => {
	const url = await getTargetInput(context, "url");
	const data = await DownloaderService.douyin(url);
	return jsonResponse(data, context.get("requestId"));
};

export const downloadSnackvideo = async (context: Context<AppEnv>): Promise<Response> => {
	const url = await getTargetInput(context, "url");
	const data = await DownloaderService.snackvideo(url);
	return jsonResponse(data, context.get("requestId"));
};

export const downloadXiaohongshu = async (context: Context<AppEnv>): Promise<Response> => {
	const url = await getTargetInput(context, "url");
	const data = await DownloaderService.xiaohongshu(url);
	return jsonResponse(data, context.get("requestId"));
};

export const downloadKuaishou = async (context: Context<AppEnv>): Promise<Response> => {
	const url = await getTargetInput(context, "url");
	const data = await DownloaderService.kuaishou(url);
	return jsonResponse(data, context.get("requestId"));
};

export const downloadMediafire = async (context: Context<AppEnv>): Promise<Response> => {
	const url = await getTargetInput(context, "url");
	const data = await DownloaderService.mediafire(url);
	return jsonResponse(data, context.get("requestId"));
};
