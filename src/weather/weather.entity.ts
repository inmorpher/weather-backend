import { IWeatherData } from '../global';

/**
 * Represents a weather entity that encapsulates weather data operations.
 */
export class WeatherEntity {
	private data: IWeatherData;
	constructor(private weatherData: IWeatherData) {
		this.data = weatherData;
	}

	/**
	 * Checks and initializes the minutely precipitation data if it does not exist.
	 * This method populates the minutely array with 60 entries, each representing a minute,
	 * with a default precipitation value of 0.
	 */
	checkPrecipitation(): void {
		if (!this.data.minutely) {
			this.data.minutely = [];
			this.data.isPrecipitation = false;
			const date = this.data.current.dt;
			this.data.minutely = Array.from({ length: 60 }, (_, index) => ({
				dt: date + index * 60,
				precipitation: 0,
			}));
		} else {
			this.data.isPrecipitation = true;
		}
	}

	/**
	 * Validates and prepares the weather data for use.
	 * Currently, it ensures that minutely precipitation data is initialized.
	 * @returns The validated and possibly modified weather data.
	 */
	validateWeatherData(): IWeatherData {
		this.checkPrecipitation();
		return this.data;
	}
}
