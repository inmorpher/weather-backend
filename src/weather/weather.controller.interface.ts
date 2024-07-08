import { NextFunction, Request, Response } from 'express';

export interface IWeatherController {
	getByName(req: Request, res: Response, next: NextFunction): void;
	getByGeo(req: Request, res: Response, next: NextFunction): void;
}
