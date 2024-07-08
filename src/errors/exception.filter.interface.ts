import { NextFunction, Request, Response } from 'express';

/**
 * Interface defining the structure for an exception filter.
 * Exception filters are used to handle errors that occur during the execution of a request in an Express application.
 */
export interface IExceptionFilter {
	/**
	 * Method to catch and handle errors.
	 *
	 * @param err The error object that was thrown.
	 * @param req The request object.
	 * @param res The response object.
	 * @param next The next middleware function in the stack.
	 */
	catch(err: Error, req: Request, res: Response, next: NextFunction): void;
}
