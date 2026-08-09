import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const pkgPath = path.join(rootDir, "node_modules", "btch-downloader", "package.json");
const browserDistPath = path.join(rootDir, "node_modules", "btch-downloader", "dist", "browser", "index.js");

if (fs.existsSync(pkgPath)) {
	try {
		const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
		pkg.browser = "dist/index.js";
		if (pkg.exports && pkg.exports["."]) {
			pkg.exports["."].browser = "./dist/index.js";
		}
		fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), "utf8");
		console.log("[fix-btch] Updated btch-downloader package.json to point browser entry to dist/index.js");
	} catch (e) {
		console.error("[fix-btch] Error updating package.json:", e);
	}
}

if (fs.existsSync(browserDistPath)) {
	try {
		let content = fs.readFileSync(browserDistPath, "utf8");
		const exportSnippet = "\nexport const { VERSION, aio, capcut, cocofun, developer, douyin, fbdown, gdrive, igdl, issues, kuaishou, mediafire, pinterest, snackvideo, soundcloud, spotify, threads, ttdl, twitter, xiaohongshu, xiaohongshuProfile, youtube, yts } = btch;\n";
		if (!content.includes("export const { VERSION")) {
			content += exportSnippet;
			fs.writeFileSync(browserDistPath, content, "utf8");
			console.log("[fix-btch] Added ESM exports to btch-downloader dist/browser/index.js");
		}
	} catch (e) {
		console.error("[fix-btch] Error updating browser/index.js:", e);
	}
}
