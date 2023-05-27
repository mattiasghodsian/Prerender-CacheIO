FROM node:18.15.0-buster-slim

LABEL maintainer="mattiasghodsian"
LABEL version="1.0.0"
LABEL description="A scalable and reliable Dockerized Prerender service, designed to boost web page performance through file-based caching"

# Update and install required packages
RUN apt-get update && apt-get install -y \
    wget curl \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libu2f-udev \
    libvulkan1 \
    xdg-utils \
    xsltproc && \
    rm -rf /var/lib/apt/lists/*

# Download and install Chrome
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -O /tmp/google-chrome-stable_current_amd64.deb \
    && dpkg -i /tmp/google-chrome-stable_current_amd64.deb || apt-get install -fy

# Create folders
RUN mkdir -p /srv/prerender /srv/cache

# Set the working directory for following COPY and CMD instructions
WORKDIR /srv/prerender

# Install NPM packages
COPY src/package*.json ./
RUN npm install --production

# Copy source files from local src directory to the workdir in the container
COPY src/ .

# Expose port 3000
EXPOSE 3000

# Run the application
CMD [ "node", "server.js"]