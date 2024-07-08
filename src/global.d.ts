export interface IGeoName {
	adminCode1: string;
	lng: string;
	geonameId: number;
	toponymName: string;
	countryId: string;
	fcl: string;
	population: number;
	countryCode: string;
	name: string;
	fclName: string;
	adminCodes1: {
		ISO3166_2: string;
	};
	countryName: string;
	fcodeName: string;
	adminName1: string;
	lat: string;
	fcode: string;
}
export interface IGeoNameResponse {
	totalResultsCount: number;
	geonames: IGeoName[];
}

interface IAirQualityData {
	coord: {
		lon: number;
		lat: number;
	};
	list: Array<{
		main: {
			aqi: number;
		};
		components: {
			co: number;
			no: number;
			no2: number;
			o3: number;
			so2: number;
			pm2_5: number;
			pm10: number;
			nh3: number;
		};
		dt: number;
	}>;
}

export interface IWeatherData {
	lat: number;
	lon: number;
	timezone: string;
	timezone_offset: number;
	current: ICurrentWeather;
	minutely?: MinutelyWeather[];
	isPrecipitation: boolean;
	hourly: HourlyWeather[];
	daily: DailyWeather[];
}

export interface IWeatherFullData extends IWeatherData {
	lat: string;
	lon: string;
	city: string;
	country: string;
	countryCode: string;
	state: string;
}

export interface ICurrentWeather {
	dt: number;
	sunrise: number;
	sunset: number;
	temp: number;
	feels_like: number;
	pressure: number;
	humidity: number;
	dew_point?: number;
	air_pollution?: number;
	uvi: number;
	clouds: number;
	visibility: number;
	wind_speed: number;
	wind_deg: number;
	wind_gust?: number;
	weather: Weather[];
}

export interface MinutelyWeather {
	dt: number;
	precipitation: number;
}

export interface HourlyWeather {
	dt: number;
	temp: number;
	feels_like: number;
	pressure: number;
	humidity: number;
	dew_point: number;
	uvi: number;
	clouds: number;
	visibility: number;
	wind_speed: number;
	wind_deg: number;
	wind_gust: number;
	weather: Weather[];

	pop: number;
}

export interface DailyWeather {
	dt: number;
	sunrise: number;
	sunset: number;
	moonrise: number;
	moonset: number;
	moon_phase: number;
	summary: string;
	temp: {
		day: number;
		min: number;
		max: number;
		night: number;
		eve: number;
		morn: number;
	};
	feels_like: {
		day: number;
		night: number;
		eve: number;
		morn: number;
	};
	pressure: number;
	humidity: number;
	dew_point?: number;
	wind_speed: number;
	wind_deg: number;
	wind_gust?: number;
	air_pollution?: number;
	weather: Weather[];
	clouds: number;
	pop: number;
	rain?: number;
	snow?: number;
	uvi: number;
}

export interface Weather {
	id: number;
	main: string;
	description: string;
	icon: string;
}

export type WeatherTemp = {
	day: number;
	min: number;
	max: number;
	night: number;
	eve: number;
	morn: number;
};
