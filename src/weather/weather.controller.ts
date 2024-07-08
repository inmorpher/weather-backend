import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { BaseController } from '../common/base.controller';
import { ValidateMiddleware } from '../common/validate.middleware';
import { HTTPError } from '../errors/http-error.class';
import { ILogger } from '../logger/logger.service.interface';
import { OpenWeatherService } from '../services/openweather.service';
import { TYPES } from '../types';

import { IWeatherData, IWeatherFullData } from '../global';
import { IGeocodingResponse, IGeocodingService } from '../services/geocoding.interface';
import { WeatherAutoCompleteDTO } from './dto/weather-autocomplete.dto';
import { WeatherByGeoDTO } from './dto/weather-bygeo.dto';
import { WeatherByNameDTO } from './dto/weather-byname.dto';
import { IWeatherController } from './weather.controller.interface';

@injectable()
export class WeatherController extends BaseController implements IWeatherController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.IGeocodingService) private geolocationService: IGeocodingService,
		@inject(TYPES.OpenWeatherService) private openWeatherService: OpenWeatherService
	) {
		super(loggerService);
		this.bindRoutes([
			{
				method: 'get',
				path: '/byName',
				func: this.getByName,
				middlewares: [new ValidateMiddleware(WeatherByNameDTO)],
			},
			{
				method: 'get',
				path: '/byGeo',
				func: this.getByGeo,
				middlewares: [new ValidateMiddleware(WeatherByGeoDTO)],
			},
			{
				method: 'get',
				path: '/autocomplete',
				func: this.autocomplete,
				middlewares: [new ValidateMiddleware(WeatherAutoCompleteDTO)],
			},
		]);
	}

	/**
	 * Handles the request to get weather data by a place name.
	 * This method first uses the geolocation service to find the latitude and longitude
	 * of the given place name. If the geolocation is found, it then queries the weather service
	 * to get the weather data for the found coordinates. If both services return valid data,
	 * the method combines the geolocation and weather data and sends it in the response.
	 *
	 * @param req The request object, containing the query parameter 'q' for the place name.
	 * @param res The response object, used to send back the combined geolocation and weather data.
	 * @param next The next function, used for error handling by passing errors to the next middleware.
	 * @returns If successful, sends a 200 OK response with the combined data. If the place is not found,
	 * or if there is an error with the geolocation or weather service, it passes an HTTPError to the next middleware.
	 */
	async getByName(req: Request, res: Response, next: NextFunction) {
		try {
			const geoname = await this.fetchGeolocation(req.query.q as string, next);
			if (!geoname) return;
			const { lat, lon } = geoname[0];
			const weather = await this.fetchWeatherAndAqi(lat, lon, next);
			if (!weather) return;
			this.loggerService.debug(`received data for, ${geoname[0].city} ${geoname[0].country}`);
			this.ok(res, this.combineData(geoname[0], weather));
		} catch (error) {
			next(new HTTPError(500, 'WEATHER CONTROLLER/GET BY NAME', 'Internal server error'));
		}
	}

	async getByGeo(req: Request, res: Response, next: NextFunction) {
		const requestQuery = {
			lat: req.query.lat as string,
			lon: req.query.lon as string,
		};
		try {
			const geoname = await this.fetchGeolocation(requestQuery, next);
			if (!geoname) return;
			const weather = await this.fetchWeatherAndAqi(geoname[0].lat, geoname[0].lon, next);
			if (!weather) return;
			this.loggerService.debug(`received data for, ${geoname[0].city} ${geoname[0].country}`);
			this.ok(res, this.combineData(geoname[0], weather));
		} catch (error) {
			next(new HTTPError(500, 'WEATHER CONTROLLER/GET BY GEO', 'Internal server error'));
		}
	}

	async autocomplete(req: Request, res: Response, next: NextFunction) {
		try {
			const response = await this.geolocationService.autocompleteSearch(req.query.q as string);
			this.loggerService.debug(`received ${response.length} results for query ${req.query.q}`);
			this.ok(res, response);
		} catch (error) {
			next(new HTTPError(500, 'WEATHER CONTROLLER/AUTOCOMPLETE', 'Internal server error'));
		}
	}

	private async fetchGeolocation(
		query: string | { lat: string | number; lon: string | number },
		next: NextFunction
	) {
		try {
			let geolocationResponse: Promise<IGeocodingResponse[]> | undefined;
			if (typeof query === 'string') {
				geolocationResponse = this.geolocationService.forwardSearch(query);
			} else {
				const { lat, lon } = query;
				geolocationResponse = this.geolocationService.reverseSearch(lat, lon);
			}

			if (!geolocationResponse) {
				return next(
					new HTTPError(
						404,
						'WEATHER CONTROLLER/FETCH GEOLOCATION',
						'No location found matching the query parameter.'
					)
				);
			}

			return geolocationResponse;
		} catch (error) {
			next(new HTTPError(500, 'WEATHER CONTROLLER/FETCH GEOLOCATION', 'Internal server error'));
		}
	}

	private async fetchWeatherAndAqi(lat: string, lon: string, next: NextFunction) {
		try {
			const weatherResponse = await this.openWeatherService.getAllWeather(lat, lon);
			if (!weatherResponse || !weatherResponse.data) {
				return next(new HTTPError(404, 'WEATHER CONTROLLER/FETCH WEATHER', 'Weather not found'));
			}
			const airPollution = await this.openWeatherService.getAqi(lat, lon);
			weatherResponse.data.current.air_pollution;
			return {
				...weatherResponse.data,
				current: {
					...weatherResponse.data.current,
					air_pollution: airPollution?.data.list ? airPollution.data.list[0].main.aqi : 0,
				},
			};
		} catch (error) {
			next(new HTTPError(500, 'WEATHER CONTROLLER/FETCH WEATHER', 'Internal server error'));
		}
	}
	private combineData(
		geonamesResponse: IGeocodingResponse,
		weatherResponse: IWeatherData
	): IWeatherFullData {
		const combinedData = {
			...weatherResponse,
			...geonamesResponse,
		};
		return combinedData;
	}
}
