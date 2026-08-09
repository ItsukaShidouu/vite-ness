import { ApiError } from "./api-error";

type ResponseMetadata = Record<string, unknown>;

export function requestIdFrom(request: Request): string {
	const supplied = request.headers.get("x-request-id")?.trim();

	if (supplied && supplied.length <= 128) {
		return supplied;
	}

	return crypto.randomUUID();
}

export function jsonResponse<T>(
	data: T,
	requestId: string,
	status = 200,
	metadata: ResponseMetadata = {},
): Response {
	return Response.json(
		{
			data,
			meta: {
				...metadata,
				requestId,
			},
		},
		{
			status,
			headers: {
				"x-request-id": requestId,
			},
		},
	);
}

export function errorResponse(error: ApiError, requestId: string): Response {
	return Response.json(
		{
			error: {
				code: error.code,
				message: error.message,
				...(error.details ? { details: error.details } : {}),
			},
			meta: { requestId },
		},
		{
			status: error.status,
			headers: {
				"x-request-id": requestId,
			},
		},
	);
}

export function noContentResponse(requestId: string): Response {
	return new Response(null, {
		status: 204,
		headers: {
			"x-request-id": requestId,
		},
	});
}
