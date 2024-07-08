import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { ILogger } from '../logger/logger.service.interface';
import { TYPES } from '../types';
import { IExceptionFilter } from './exception.filter.interface';
import { HTTPError } from './http-error.class';
/**
 * Implements the exception handling mechanism for the application.
 * This class is responsible for catching errors thrown during the request-response cycle,
 * logging them, and sending appropriate responses to the client.
 */
@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

	/**
	 * Catches and handles errors thrown during the request-response cycle.
	 * If the error is an instance of HTTPError, it logs the error with its context and status code,
	 * then sends a response with the corresponding status code and message.
	 * Otherwise, it logs the error message and sends a generic 500 (Internal Server Error) response.
	 *
	 * @param err - The error object caught during the request-response cycle.
	 * @param req - The request object.
	 * @param res - The response object. Used to send the error response to the client.
	 * @param next - The next function in the middleware chain. Not used in this method but required by the interface.
	 */
	catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction) {
		if (err instanceof HTTPError) {
			this.logger.error(`[${err.context}] Error ${err.statusCode}: ${err.message}`);
			res.status(err.statusCode).send(err.message);
		} else {
			this.logger.error(`${err.message}`);
			res.status(500).send({ error: err.message });
		}
	}
}
