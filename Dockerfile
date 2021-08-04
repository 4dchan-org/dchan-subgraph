# Node: https://hub.docker.com/_/node/
FROM node:16

ENV PATH="./node_modules/.bin:$PATH"

RUN apt update && apt install -y libsecret-1-dev

RUN mkdir /subgraph

WORKDIR /subgraph
