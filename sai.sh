#!/bin/bash

# start the app, and run the importer, then open a web browser

docker-compose up -d

echo "Waiting for services to be ready..."
sleep 10

echo "Running data import..."
docker-compose run server yarn run import

echo "Waiting for import to complete..."
sleep 5

echo "Opening browser..."
# linux - others here: https://stackoverflow.com/questions/38147620/shell-script-to-open-a-url#38147878
open http://localhost:3400

