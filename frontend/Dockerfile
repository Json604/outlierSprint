# Use Node.js official image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and lock file first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the frontend port
EXPOSE 3000

# Run dev server (change to `next start` if you're building for prod)
CMD ["npm", "run", "dev"]
