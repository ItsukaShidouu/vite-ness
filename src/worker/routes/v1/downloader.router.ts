import { Hono } from "hono";
import type { AppEnv } from "../../types";
import {
	downloadTiktok,
	downloadInstagram,
	downloadYoutube,
	searchYoutube,
	downloadFacebook,
	downloadTwitter,
	downloadSpotify,
	downloadSoundcloud,
	downloadThreads,
	downloadPinterest,
	downloadCapcut,
	downloadGdrive,
	downloadDouyin,
	downloadSnackvideo,
	downloadXiaohongshu,
	downloadKuaishou,
	downloadMediafire,
} from "../../controllers/downloader.controller";

export const downloaderRouter = new Hono<AppEnv>();

// Support both GET and POST requests for all downloader endpoints
downloaderRouter.on(["GET", "POST"], "/tiktok", downloadTiktok);
downloaderRouter.on(["GET", "POST"], "/instagram", downloadInstagram);
downloaderRouter.on(["GET", "POST"], "/youtube", downloadYoutube);
downloaderRouter.on(["GET", "POST"], "/ytsearch", searchYoutube);
downloaderRouter.on(["GET", "POST"], "/facebook", downloadFacebook);
downloaderRouter.on(["GET", "POST"], "/twitter", downloadTwitter);
downloaderRouter.on(["GET", "POST"], "/spotify", downloadSpotify);
downloaderRouter.on(["GET", "POST"], "/soundcloud", downloadSoundcloud);
downloaderRouter.on(["GET", "POST"], "/threads", downloadThreads);
downloaderRouter.on(["GET", "POST"], "/pinterest", downloadPinterest);
downloaderRouter.on(["GET", "POST"], "/capcut", downloadCapcut);
downloaderRouter.on(["GET", "POST"], "/gdrive", downloadGdrive);
downloaderRouter.on(["GET", "POST"], "/douyin", downloadDouyin);
downloaderRouter.on(["GET", "POST"], "/snackvideo", downloadSnackvideo);
downloaderRouter.on(["GET", "POST"], "/xiaohongshu", downloadXiaohongshu);
downloaderRouter.on(["GET", "POST"], "/kuaishou", downloadKuaishou);
downloaderRouter.on(["GET", "POST"], "/mediafire", downloadMediafire);
