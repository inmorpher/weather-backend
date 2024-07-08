import axios, { AxiosInstance } from 'axios';
import { Container, ContainerModule, interfaces } from 'inversify';
import { ENV } from '../envConsts';
import { App } from './app';
import { ExceptionFilter } from './errors/exception.filter';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { LoggerService } from './logger/logger.service';
import { ILogger } from './logger/logger.service.interface';
import { IGeocodingService } from './services/geocoding.interface';
import { OpenWeatherService } from './services/openweather.service';
import { OpenWeatherGeoService } from './services/openweathergeo.service';
import { TYPES } from './types';
import { WeatherController } from './weather/weather.controller';

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter).inSingletonScope();
	bind<WeatherController>(TYPES.WeatherController).to(WeatherController).inSingletonScope();
	bind<IGeocodingService>(TYPES.IGeocodingService).to(OpenWeatherGeoService).inSingletonScope();
	bind<OpenWeatherService>(TYPES.OpenWeatherService).to(OpenWeatherService).inSingletonScope();
	bind<AxiosInstance>(TYPES.GeonamesAxiosInstance).toConstantValue(
		axios.create({
			baseURL: 'https://api.geoapify.com/v1/geocode',
			params: {
				apiKey: ENV.GEOAPIFY_API_ID,
			},
		})
	);
	bind<AxiosInstance>(TYPES.OpenWeatherAxiosInstance).toConstantValue(
		axios.create({
			baseURL: 'https://api.openweathermap.org',
			params: {
				appid: ENV.WEATHER_API_ID,
			},
		})
	);
	bind<App>(TYPES.Application).to(App).inSingletonScope();
});

const bootstrap = () => {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();

	return { app, appContainer };
};

export const { app, appContainer } = bootstrap();
