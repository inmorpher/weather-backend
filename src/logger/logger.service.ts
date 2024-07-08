import { injectable } from 'inversify';
import 'reflect-metadata';
import { Logger } from 'tslog';
import { ILogger } from './logger.service.interface';
@injectable()
export class LoggerService implements ILogger {
	public logger: Logger<{}>;
	constructor() {
		this.logger = new Logger({
			type: 'pretty',
		});
	}

	public log(...args: unknown[]): void {
		this.logger.info(...args);
	}

	public error(...args: unknown[]): void {
		this.logger.error(...args);
	}

	public warn(...args: unknown[]): void {
		this.logger.warn(...args);
	}

	public debug(...args: unknown[]): void {
		this.logger.debug(...args);
	}

	public silly(...args: unknown[]): void {
		this.logger.silly(...args);
	}
}
