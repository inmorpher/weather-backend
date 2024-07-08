FROM node:18.15

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Set environment variables
ENV NODE_ENV=development

# Expose the port the app runs on
EXPOSE 3002

# Start the app
CMD ["npm", "run", "dev"]