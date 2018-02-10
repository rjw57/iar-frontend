# iar-frontend
[![Build Status](https://travis-ci.org/uisautomation/iar-frontend.svg?branch=master)](https://travis-ci.org/uisautomation/iar-frontend)

Frontend for IAR web application. Bootstrapped with Create React App.

## Install dependencies

`npm install`

## Run a development instance

To run locally, firstly start a local copy of the IAR backend, OAuth2 endpoint
and lookupproxy:

`docker-compose up`

Then create the "testclient" OAuth2 client:

`./scripts/create-client.sh`

Then start the local development server:

`npm start`

**NOTE:** The "testclient" client can also be used to log into the asset register
developer UI at http://localhost:8000/ui and also to log into the lookup proxy
developer UI at http://localhost:8080/ui.

## Build for production

`npm run build`

## Run the tests

`npm test`

## Serve some documentation on the components

`npm run styleguide`
