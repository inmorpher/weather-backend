import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
	SERVER: process.env.SERVER,
	PORT: process.env.PORT || 3000,
	WEATHER_API_ID: process.env.WEATHER_API_ID,
	GEONAMES_API_ID: process.env.GEO_USERNAME,
	GEOAPIFY_API_ID: process.env.GEOAPIFY_API_ID,
};
