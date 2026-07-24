export type Bindings = {
	/** SQLite-backed Durable Object used by the sample todo resource. */
	TODO_STORE: DurableObjectNamespace;
	/** A comma-separated allowlist of browser origins, or `*`. */
	CORS_ORIGIN?: string;
	/** Optional Worker secret. When set, todo routes require a Bearer token. */
	API_KEY?: string;
};

export type AppEnv = {
	Bindings: Bindings;
	Variables: {
		requestId: string;
		startedAt: number;
	};
};

export type Todo = {
	id: string;
	title: string;
	description: string | null;
	completed: boolean;
	createdAt: string;
	updatedAt: string;
};

export type CreateTodoInput = {
	title: string;
	description: string | null | undefined;
	completed: boolean | undefined;
};

export type UpdateTodoInput = {
	title: string | undefined;
	description: string | null | undefined;
	completed: boolean | undefined;
};
