import { AxiosInstance, AxiosResponse } from 'axios';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { HTTPError } from '../errors/http-error.class';
import { IAirQualityData, IWeatherData } from '../global';
import { ILogger } from '../logger/logger.service.interface';
import { TYPES } from '../types';
import { WeatherEntity } from '../weather/weather.entity';

@injectable()
export class OpenWeatherService {
	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.OpenWeatherAxiosInstance) private openWeatherAPI: AxiosInstance
	) {}

	/**
	 * Fetches all weather data for a given latitude and longitude.
	 * @param {string} lat - The latitude of the location.
	 * @param {string} lng - The longitude of the location.
	 * @returns {Promise<AxiosResponse<IWeatherData | void>>} A promise that resolves to the weather data response.
	 * @throws {HTTPError} Throws an HTTPError if the request fails.
	 */
	async getAllWeather(lat: string, lng: string): Promise<AxiosResponse<IWeatherData | void>> {
		try {
			const response = await this.openWeatherAPI.get('/data/3.0/onecall', {
				params: {
					lat,
					lon: lng,
				},
			});

			const validatedData = new WeatherEntity(response.data).validateWeatherData();
			return {
				data: validatedData,
				status: response.status,
				statusText: response.statusText,
				headers: response.headers,
				config: response.config,
				request: response.request,
			};
		} catch (error) {
			throw new HTTPError(error, 'OPEN WEATHER SERVICE/GET ALL WEATHER', 'Internal server error');
		}
	}

	/**
	 * Fetches the Air Quality Index (AQI) data for a given latitude and longitude.
	 * @param {string} lat - The latitude of the location.
	 * @param {string} lng - The longitude of the location.
	 * @returns {Promise<AxiosResponse<IAirQualityData> | undefined>} A promise that resolves to the AQI data response or undefined if the request fails.
	 */
	async getAqi(lat: string, lng: string): Promise<AxiosResponse<IAirQualityData> | undefined> {
		try {
			return await this.openWeatherAPI.get('/data/2.5/air_pollution', {
				params: {
					lat,
					lon: lng,
				},
			});
		} catch (error) {
			this.logger.warn('Failed to get air pollution data, method returned undefined');
			return undefined;
		}
	}
}
