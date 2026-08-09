import {
	ttdl,
	igdl,
	youtube,
	yts,
	fbdown,
	twitter,
	spotify,
	soundcloud,
	threads,
	pinterest,
	capcut,
	gdrive,
	douyin,
	snackvideo,
	xiaohongshu,
	kuaishou,
	mediafire,
} from "btch-downloader";

export class DownloaderService {
	static async tiktok(url: string) {
		return await ttdl(url);
	}

	static async instagram(url: string) {
		return await igdl(url);
	}

	static async youtube(url: string) {
		return await youtube(url);
	}

	static async youtubeSearch(query: string) {
		return await yts(query);
	}

	static async facebook(url: string) {
		return await fbdown(url);
	}

	static async twitter(url: string) {
		return await twitter(url);
	}

	static async spotify(url: string) {
		return await spotify(url);
	}

	static async soundcloud(url: string) {
		return await soundcloud(url);
	}

	static async threads(url: string) {
		return await threads(url);
	}

	static async pinterest(queryOrUrl: string) {
		return await pinterest(queryOrUrl);
	}

	static async capcut(url: string) {
		return await capcut(url);
	}

	static async gdrive(url: string) {
		return await gdrive(url);
	}

	static async douyin(url: string) {
		return await douyin(url);
	}

	static async snackvideo(url: string) {
		return await snackvideo(url);
	}

	static async xiaohongshu(url: string) {
		return await xiaohongshu(url);
	}

	static async kuaishou(url: string) {
		return await kuaishou(url);
	}

	static async mediafire(url: string) {
		return await mediafire(url);
	}
}
