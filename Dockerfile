FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install root (if any)
RUN npm install

# Install server & client separately
RUN cd server && npm install
RUN cd client && npm install --legacy-peer-deps

# Copy source
COPY . .

# Build frontend
RUN cd client && npm run build

# Expose backend port
EXPOSE 5000

# Start backend
CMD ["node", "server/index.js"]
