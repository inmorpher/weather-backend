import axios, { AxiosError } from 'axios';

/**
 * Represents an HTTP error with a status code and optional context.
 * Extends the native JavaScript `Error` class.
 */
export class HTTPError extends Error {
	/**
	 * The HTTP status code associated with the error.
	 */
	statusCode: number;

	/**
	 * Optional context information about the error.
	 */
	context?: string;

	/**
	 * Constructs a new `HTTPError` instance.
	 *
	 * @param statusCode The HTTP status code associated with the error.
	 * @param message The error message.
	 * @param context Optional context information about the error.
	 */
	constructor(error: AxiosError | number | unknown, context?: string, message?: string) {
		if (typeof error === 'number') {
			super(message);
			this.statusCode = error;
			this.message = message || 'Error';
			this.context = context;
		} else if (axios.isAxiosError(error)) {
			super(error.message);
			this.statusCode = error.response?.status || 500;
			this.message = error.response?.data?.message || error.message;
			this.context = context;
		} else {
			super(message);
			this.statusCode = 500;
			this.message = message || 'Unknown Error';
			this.context = context;
		}
	}
}
