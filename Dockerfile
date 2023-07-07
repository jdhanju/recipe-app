# # pull official base image
# FROM node

# # set working directory
# WORKDIR /app

# # add `/app/node_modules/.bin` to $PATH
# ENV PATH /app/node_modules/.bin:$PATH

# # install app dependencies
# COPY  package.json ./
# COPY package-lock.json ./
# COPY src ./
# COPY public ./
# RUN npm install --silent
# RUN npm install react-scripts -g --silent


# # start app
# CMD ["npm", "start"]
# Use an official Node.js image as the base
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install --only=production

# Copy the entire project to the working directory
COPY . .

# Build the React app
RUN npm run build

# Expose a port if necessary (e.g., for serving the built app)
# EXPOSE 3000

# Define the command to run the app
CMD ["npm", "start"]