# Prerender-CacheIO
<p>
    <a href="https://www.buymeacoffee.com/mattiasghodsian" target="_new">
        <img src="https://img.shields.io/badge/Donate-Coffee-blue?style=for-the-badge&amp;logo=buymeacoffee" alt="Donate Coffee">
    </a>
    <a href="https://github.com/mattiasghodsian/Prerender-CacheIO/stargazers" target="_new">
        <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/mattiasghodsian/Prerender-CacheIO?style=for-the-badge&logo=github&label=Stars&color=blue">
    </a>
    <a href="https://github.com/mattiasghodsian/Prerender-CacheIO/releases/latest" target="_new">
        <img alt="Latest Release" src="https://img.shields.io/github/v/release/mattiasghodsian/Prerender-CacheIO?style=for-the-badge&logo=github&label=Latest%20Release&color=blue">
    </a>
    <a href="https://hub.docker.com/r/rakma/prerender-cache-io" target="_new">
        <img alt="Docker Pulls" src="https://img.shields.io/docker/pulls/rakma/prerender-cache-io?style=for-the-badge&logo=docker&label=Pulls&color=blue">
    </a>
    <a href="https://hub.docker.com/r/rakma/prerender-cache-io/stars" target="_new">
        <img alt="Docker Stars" src="https://img.shields.io/docker/stars/rakma/prerender-cache-io?style=for-the-badge&logo=docker&label=Stars&color=blue">
    </a>
</p>

A Dockerized [Prerender (v5.20.2)](https://github.com/prerender/prerender) container, designed to boost web page performance through file-based caching.

## Getting Started

These instructions will help you to set up Prerender-CacheIO on your machine using Docker and Docker Compose.

**Build and run the Docker container** 

```yml
version: "3"
services:
  prerender:
    image: rakma/prerender-cache-io:latest
    container_name: prerenderCacheIO
    networks:
      - default
    volumes:
      - ./cache:/srv/cache
      #- ./prerender:/srv/prerender
    ports:
      - "3001:3000"
    restart: always
```

```bash
docker-compose up -d
```

## ToDo
- [ ] The current configuration sets the cache file lifespan to 24 hours. In future updates, this will be modifiable through an environment variable argument.
