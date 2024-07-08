import { json } from 'body-parser';
import cors from 'cors';
import express, { Express, urlencoded } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { ENV } from '../envConsts';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { ILogger } from './logger/logger.service.interface';
import { TYPES } from './types';
import { WeatherController } from './weather/weather.controller';

@injectable()
export class App {
	app: Express;
	server: Server | null = null;
	port: string | number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.WeatherController) private weatherController: WeatherController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter
	) {
		this.app = express();
		this.port = ENV.PORT;
	}

	useMiddleware(): void {
		this.app.use(json());
		this.app.use(urlencoded({ extended: true }));
	}

	useRoutes() {
		this.app.use(cors());
		this.app.use('/search', this.weatherController.router);
	}

	useExceptionFilters() {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}
	public async init() {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilters();
		this.server = this.app.listen(this.port);
		this.logger.log(`Example app listening on port ${this.port}!`);
	}
}
