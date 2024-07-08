# Weather Backend

## Description

Weather Backend is a server-side application that provides an API for retrieving weather information. It uses various external APIs to fetch weather and geolocation data.

## Getting Started

Follow these instructions to get the project up and running locally.

### Prerequisites

Make sure you have the following software installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Git](https://git-scm.com/)

### Installation

1. Clone the repository:

```sh
git clone https://github.com/inmorpher/weather-backend.git
cd weather-backend
```

2. Install dependencies:

```sh
npm install
```

### Configuration

Create a .env file in the root directory of the project and add the following environment variables:

```env
PORT='your_port'
GEO_USERNAME='your_geonames_username'
WEATHER_API_ID='your_openweather_api_key'
GEOAPIFY_API_ID='your_geoapify_api_key'
```

You need to obtain API keys from the following services:

- [OpenWeather](https://openweathermap.org/) - Sign up and get your API key
- [Geonames](https://www.geonames.org/) - Sign up and get your username
- [Geoapify](https://www.geoapify.com/geocoding-api/) - Sign up and get your API key

### Running the Application

To run the server in development mode, use the following command:

```sh
npm start
```

### Building the Project

To build the project, use the following command:

```sh
npm run build
```

### Testing

To run tests, use the following command:

```sh
npm run test
```

### Project Structure

- src: Main application code
  - app.ts: Main entry point of the application
  - server.ts: Server setup and request handling
  - common: Shared code and interfaces
  - errors: Error-related classes and interfaces
  - logger: Logger service and interface
  - services: Service-related files and types
  - weather: Weather-related controller, entity, and DTOs

* dist: Compiled code
* node_modules: Project dependencies
* package.json: Project metadata, including dependencies and scripts
* tsconfig.json: TypeScript compiler configuration
* jest.config.js: Configuration for the Jest testing framework
* Dockerfile: Instructions for building a Docker image
* data.json: JSON data
* envConsts.ts: Environment-related constants

### Contributing

1. Fork the repository
2. Create a new branch (git checkout -b feature/YourFeature)
3. Commit your changes (git commit -m 'Add some feature')
4. Push to the branch (git push origin feature/YourFeature)
5. Open a Pull Request

### Licence

This project is licensed under the MIT License. See the LICENSE file for details.
