export type Bindings = {
	/** A comma-separated allowlist of browser origins, or `*`. */
	CORS_ORIGIN?: string;
	/** Optional Worker secret. When set, download routes require a Bearer token. */
	API_KEY?: string;
};

export type AppEnv = {
	Bindings: Bindings;
	Variables: {
		requestId: string;
		startedAt: number;
	};
};
