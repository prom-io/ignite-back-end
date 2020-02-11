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
        - [Backend](#backend)
        - [Front-end](#front-end)
- [Current Stage of project](#current-stage-of-project)

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

[Here](http://178.128.240.29/) is an instance of app, which is alreay deployed at the stage environent for the demo purposes. 
So you can test all the essence features of the application using UI: 
- upload Data Owners' files with their metadata;
- browse uploaded Data Owners' files list;
- browse the sales transactions list;
- select PROM wallet as the default for the uploads;
- browse the sales transactions list.

Here is a [manual](https://github.com/Prometeus-Network/data-validator-node/blob/master/test.md) with screenshots: testing guideline for the operations listed above.

## License

Prometeus Network is licensed under the Apache software license (see LICENSE [file](https://github.com/Prometeus-Network/prometeus/blob/master/LICENSE)). Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either \express or implied.

Prometeus Network makes no representation or guarantee that this software (including any third-party libraries) will perform as intended or will be free of errors, bugs or faulty code. The software may fail which could completely or partially limit functionality or compromise computer systems. If you use or implement it, you do so at your own risk. In no event will Prometeus Network be liable to any party for any damages whatsoever, even if it had been advised of the possibility of damage.

As such this codebase should be treated as experimental and does not contain all currently developed features. Prometeus Network will be delivering regular updates.

## How it works

Upon starting, Data Validator node performs the following steps:
 - Backend API startup
   - Local database initialization
 - Client application startup

After startup, Data Validator node exposes RESTful API which allows to perform the following operations:
- Creation of data owners and uploading their files to Prometeus network
- Files storage duration prolongation
- Account registration
- Transactions history view

## How to run

### Prerequisites

In order to run Data Mart node, you have to install:
- Docker. You can find installation instructions on [official website](https://docs.docker.com/install/)
- Docker-compose, which can be found [here](https://docs.docker.com/compose/install/)
- Create and configure `bootstrap-nodes.json` file if you don't want to use default bootstrap nodes. This file contains 
information about bootstrap nodes which help to discover other nodes in network. Below is the content of default `bootstrap-nodes.json` file:
```
{
  "bootstrapNodes": [
    {
      "ipAddress": "188.166.37.102",
      "port": 2000,
      "libp2pAddress": "/ip4/188.166.37.102/tcp/12345/p2p/QmekndSMXKCGLFXp4peHpf9ynLWno6QFbo1uqMq8HBPqtz"
    },
    {
      "ipAddress": "134.209.95.239",
      "port": 2000,
      "libp2pAddress": "/ip4/134.209.95.239/tcp/12346/p2p/QmaF43H5yth1nGWBF4xYEkqaL7X4uUsGNr3vhFbsAWnje6"
    }
  ]
}
```
- If you want to run Data Mart node outside of Docker container, you will need to install
    - NodeJS of latest version, which can be found on the [official website](https://nodejs.org/en/download/current/)
    - Yarn. Its installation instruction is also available on
    [Yarn's official website](https://legacy.yarnpkg.com/en/docs/install/#debian-stable).

### Build and run process

Firstly, you need to clone this repository with the following command:

```git clone https://github.com/Prometeus-Network/data-validator-node.git```

After repository is cloned, you need to initialize submodules with the following commands:

```git submodule init```

```git submodule update```

#### Running inside Docker

In order to run Data Validator node inside Docker container, you need to do the following:

- Create`.env` file in project's **root** directory and configure environmental variables. It is required to configure environmental 
variables for both backend and front-end applications
    - You can find description of environmental variables for [backend](#backend) and [front-end](#front-end) below
- While in project directory, run the following command:

```docker-compose up --build``` or ```docker-compose up --build -d``` if you want to run the application in detached mode.

#### Running outside Docker

If you want to run Data Mart node outside Docker, you will need to to the following:

- Backend API
  - Run `yarn global add @nestjs/cli to install NestJS CLI`
  - Go to `backend` directory and run `yarn istall` command to install all dependencies for backend application
  - Create `.env` file and configure it with the variables described [below](#backend)
  - Run `yarn run start` to start up backend application
- Client application
  - Go to `front-end` directory and run `yarn run install` command to install all dependencies for front-end application
  - Create `.env` file and configure it with the variables described [below](#front-end)
  - Run `yarn run production` to start up client application
      - If you want to run front-end application in development mode,
      run `yarn run start`


### Environmental variables

#### Backend 

| Variable                        | Description                                                                                                                                                                                          |
|---------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `DATA_VALIDATOR_API_PIRT`       | Port which will be used by backend API                                                                                                                                                               |
| `LOGGING_LEVEL`                 | Level of logging verbosity. Allowed values are debug, info, warn, error                                                                                                                              |
| `NEDB_DIRECTORY`                | Directory which will be used by local Nedb database                                                                                                                                                  |
| `ENCRYPTOR_SERVICE_URL`         | URL of Encryptor service                                                                                                                                                                             |
| `INITIAL_ACCOUNT_PRIVATE_KEY`   | Private key to Ethereum account which will be used for registration upon first startup                                                                                                               |
| `USE_LOCAL_IP_FOR_REGISTRATION` | Indicates whether local IP address should be used for registering itself to bootstrap node. This may be useful for development purposes or if your bootstrap nodes are located in your local network |
| `LOCAL_FILES_DIRECTORY`         | Path to directory which is used for initial data upload, before sending data to Service node. Please make sure that you have read and write access to this directory                                 |

#### Front-end

| Variable                                     | Description                                                      |
|----------------------------------------------|------------------------------------------------------------------|
| `REACT_APP_DATA_VALIDATOR_NODE_API_BASE_URL` | URL of backend API                                               |
| `REACT_APP_PRODUCTION_PORT`                  | Port which will be used by client application in production mode |

## Current Stage of project

What Validator node can do now:

- It creates data owners and uploads files to Prometeus network;
- It allows to prolong file storage duration;
- It can show history of data sales.
