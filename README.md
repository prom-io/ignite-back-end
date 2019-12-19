# Data Validator Node

## Table of contents

- [Description](#description)
- [How to test](#how-to-test)
- [License](#license)
- [How it works](#how-it-works)
- [How to run](#how-to-run)
    - [Prerequisites](#prerequisites)
    - [Build and run process](#build-and-run-process)
        - [Running inside Docker](#running-inside-docker)
        - [Running outside Docker](#running-outside-docker)
    - [Environmental variables](#environmental-variables)
        - [Bakcend](#backend)
        - [Front-end](#front-end)
- [Stages of project](#stages-of-project)
    - [What Data Mart node can do now](#what-data-validator-node-can-do-now)
    - [What Data mart node will do in the future](#what-data-validator-node-will-do-in-the-future)


## Description

Data Validator node is an application which is responsible 
for aggregation and validation of the data from the Data Owners and provide 
it to Prometeus ecosystem. It provides RESTful API  and user interface for uploading data. 
The Node uploads data of Data Owners to the Prometeus network using API
of Service Node so that it can become available for purchase to Data marts. 
The payment for the storage of that data is charged at the moment of upload 
via the smart contract. Besides that, Data Validator Node makes initial 
encryption of uploaded data using the Data Owner's public key.

## How to test

Demo client application can be found [here](http://178.128.240.29/)

## License

Prometeus Network is licensed under the Apache software license (see LICENSE [file](https://github.com/Prometeus-Network/prometeus/blob/master/LICENSE)). Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either \express or implied.

Prometeus Network makes no representation or guarantee that this software (including any third-party libraries) will perform as intended or will be free of errors, bugs or faulty code. The software may fail which could completely or partially limit functionality or compromise computer systems. If you use or implement it, you do so at your own risk. In no event will Prometeus Network be liable to any party for any damages whatsoever, even if it had been advised of the possibility of damage.

As such this codebase should be treated as experimental and does not contain all currently developed features. Prometeus Network will be delivering regular updates.

## How it works

Upon starting, Data Validator node performs the following steps:
 - Backend API startup
   - Local database intialization
 - Client application startup

After startup, Data Validator node exposes RESTful API which allows to perform the following operations:
- Creation of data owners and uploading their files to Prometeus network
- Files storage duration prolongation
- Account registration
- Transactions history view

## How to run

### Prerequisites

In order to run Data Mart node, you have to install:
- Latest NodeJS version, which can be found on the [official website](https://nodejs.org/en/download/current/)
- Docker. You can find installation instructions on [official website](https://docs.docker.com/install/)
- Docker-compose, which can be found [here](https://docs.docker.com/compose/install/)

### Build and run process

Firstly, you need to clone this repository with the following command:

```git clone https://github.com/Prometeus-Network/data-validator-node.git```

After repository is cloned, you need to initialize submodules with the following commands:

```git submodule init```

```git submodule update```

#### Running inside Docker

In order to run Data Validator node inside Docker container, you need to do the following:

- While in project directory, run the following command:

```docker-compose up --build``` or ```docker-compose up --build -d``` if you want to run the application in detached mode.

#### Running outside Docker

If you want to run Data Mart node outside Docker, you will need to to the following:

- Backend API
  - Go to `backend` directory and run `npm istall` command to install all dependencies for backend application
  - Create `.env` file and configure it with the variables described [below](#backend)
  - Run `npm run start` to start up backend applicationd
- Client application
  - Go to `front-end` directory and run `npm run start` command to install all dependencies for front-end application
  - Create `.env` file and configure it with the variables described [below](#front-end)
  - Run `npm run production` to start up client application


### Environmental variables

#### Backend 

| Variable                   | Description                                                                             |
|----------------------------|-----------------------------------------------------------------------------------------|
| SERVICE_NODE_API_URL       | URL of Service node API                                                                 |
| PORT                       | Port which will be used by backend API                                                  |
| LOGGING_LEVEL              | Level of logging verbosity. Allowed values are trace, debug, info, warning, error       |



#### Front-end

| Variable                              | Description                                                      |
|---------------------------------------|------------------------------------------------------------------|
| REACT_APP_DATA_VALIDATOR_NODE_API_BASE_URL | URL of backend API                                               |
| REACT_APP_PRODUCTION_PORT             | Port which will be used by client application in production mode |

## Stages of project

### What Validator node can do now

- It creates data owners and uploads files to Prometeus network;
- It allows to prolong file storage duration;
- It can show history of data sales;

### What Data Validator node will do in the future

