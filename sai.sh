#!/bin/bash

# start the app, and run the importer, then open a web browser

docker-compose up -d

docker-compose run server yarn run import

# linux - others here: https://stackoverflow.com/questions/38147620/shell-script-to-open-a-url#38147878
open http://localhost:3400

