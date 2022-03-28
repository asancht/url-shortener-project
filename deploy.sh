#!/bin/bash

git clone https://github.com/asancht/url-shortener-project.git

cd url-shortener-project/server

echo "Building server"
docker-compose -f ./server/docker-compose.yml up -d --build
