import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { IMiddleware } from './middleware.interface';
@injectable()
export class ValidateMiddleware implements IMiddleware {
	constructor(private classToValidate: ClassConstructor<object>) {}

	execute({ query }: Request, res: Response, next: NextFunction): void {
		const instance = plainToClass(this.classToValidate, query);
		validate(instance).then((errors) => {
			if (errors.length > 0) {
				res.status(422).send(errors);
			} else {
				next();
			}
		});
	}
}
