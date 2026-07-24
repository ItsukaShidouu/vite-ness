import { ApiError } from "./api-error";
import type { CreateTodoInput, UpdateTodoInput } from "../types";

type JsonObject = Record<string, unknown>;

const todoFields = new Set(["title", "description", "completed"]);
const todoIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function readJsonObject(request: Request): Promise<JsonObject> {
	const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";

	if (!contentType.includes("application/json")) {
		throw new ApiError(
			415,
			"UNSUPPORTED_MEDIA_TYPE",
			"Gunakan header Content-Type: application/json.",
		);
	}

	try {
		const body: unknown = await request.json();

		if (!isJsonObject(body)) {
			throw new ApiError(422, "VALIDATION_ERROR", "Body harus berupa objek JSON.");
		}

		return body;
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}

		throw new ApiError(400, "INVALID_JSON", "Body JSON tidak valid.");
	}
}

export async function parseCreateTodo(request: Request): Promise<CreateTodoInput> {
	const body = await readJsonObject(request);
	assertAllowedFields(body);

	return {
		title: readRequiredText(body, "title", 200),
		description: readOptionalText(body, "description", 2_000),
		completed: readOptionalBoolean(body, "completed"),
	};
}

export async function parseUpdateTodo(request: Request): Promise<UpdateTodoInput> {
	const body = await readJsonObject(request);
	assertAllowedFields(body);

	const update: UpdateTodoInput = {
		title: hasField(body, "title") ? readRequiredText(body, "title", 200) : undefined,
		description: hasField(body, "description")
			? readOptionalText(body, "description", 2_000)
			: undefined,
		completed: hasField(body, "completed")
			? readOptionalBoolean(body, "completed")
			: undefined,
	};

	if (
		update.title === undefined &&
		update.description === undefined &&
		update.completed === undefined
	) {
		throw new ApiError(
			422,
			"VALIDATION_ERROR",
			"Kirim setidaknya satu field yang ingin diperbarui.",
		);
	}

	return update;
}

export function parseTodoId(value: string): string {
	if (!todoIdPattern.test(value)) {
		throw new ApiError(400, "INVALID_ID", "ID todo tidak valid.");
	}

	return value;
}

export function parseTodoListQuery(url: URL): {
	page: number;
	limit: number;
	completed: boolean | undefined;
} {
	const page = parsePositiveInteger(url.searchParams.get("page"), "page", 1, 10_000);
	const limit = parsePositiveInteger(url.searchParams.get("limit"), "limit", 20, 100);
	const completedValue = url.searchParams.get("completed");

	if (completedValue === null) {
		return { page, limit, completed: undefined };
	}

	if (completedValue === "true") {
		return { page, limit, completed: true };
	}

	if (completedValue === "false") {
		return { page, limit, completed: false };
	}

	throw new ApiError(
		422,
		"VALIDATION_ERROR",
		"Query completed harus bernilai true atau false.",
		{ field: "completed" },
	);
}

function isJsonObject(value: unknown): value is JsonObject {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertAllowedFields(body: JsonObject): void {
	const unexpectedFields = Object.keys(body).filter((field) => !todoFields.has(field));

	if (unexpectedFields.length > 0) {
		throw new ApiError(
			422,
			"VALIDATION_ERROR",
			"Body berisi field yang tidak didukung.",
			{ fields: unexpectedFields },
		);
	}
}

function readRequiredText(body: JsonObject, field: string, maximumLength: number): string {
	const value = body[field];

	if (typeof value !== "string") {
		throw validationError(field, "harus berupa string.");
	}

	const text = value.trim();

	if (text.length === 0) {
		throw validationError(field, "tidak boleh kosong.");
	}

	if (text.length > maximumLength) {
		throw validationError(field, `maksimum ${maximumLength} karakter.`);
	}

	return text;
}

function readOptionalText(
	body: JsonObject,
	field: string,
	maximumLength: number,
): string | null | undefined {
	if (!hasField(body, field)) {
		return undefined;
	}

	const value = body[field];

	if (value === null) {
		return null;
	}

	if (typeof value !== "string") {
		throw validationError(field, "harus berupa string atau null.");
	}

	const text = value.trim();

	if (text.length > maximumLength) {
		throw validationError(field, `maksimum ${maximumLength} karakter.`);
	}

	return text.length === 0 ? null : text;
}

function readOptionalBoolean(body: JsonObject, field: string): boolean | undefined {
	if (!hasField(body, field)) {
		return undefined;
	}

	const value = body[field];

	if (typeof value !== "boolean") {
		throw validationError(field, "harus berupa boolean.");
	}

	return value;
}

function parsePositiveInteger(
	value: string | null,
	field: string,
	fallback: number,
	maximum: number,
): number {
	if (value === null) {
		return fallback;
	}

	const parsed = Number(value);

	if (!Number.isInteger(parsed) || parsed < 1 || parsed > maximum) {
		throw new ApiError(
			422,
			"VALIDATION_ERROR",
			`${field} harus berupa bilangan bulat antara 1 dan ${maximum}.`,
			{ field },
		);
	}

	return parsed;
}

function hasField(body: JsonObject, field: string): boolean {
	return Object.prototype.hasOwnProperty.call(body, field);
}

function validationError(field: string, reason: string): ApiError {
	return new ApiError(422, "VALIDATION_ERROR", `${field} ${reason}`, { field });
}
