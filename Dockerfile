FROM node:12.18.3-buster-slim

RUN apt-get update && apt-get install -y procps
