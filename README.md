# Ignite Back-end

## Table of contents

- [Description](#description)
- [How to test](#how-to-test)
- [License](#license)
- [How it works](#how-it-works)
- [How to run](#how-to-run)
    - [Prerequisites](#prerequisites)
    - [Build and run process](#build-and-run-process)
        - [Running inside Docker](#running-inside-docker)
    - [Environmental variables](#environmental-variables)
- [Current Stage of project](#current-stage-of-project)

## Description

Ignite is a decentralized social network, which allows everyone to share her/his mind freely via texts and media files. All the posts are distributed through Ethereum blockchain and stored immutable in distributed Data Storage.

## How to test

Testing of the current functionality of Ignite can be performed via User Interface implemented in Ignite [front-end](https://github.com/Prometeus-Network/ignite-front-end) repo.

## License

Prometeus Network is licensed under the Apache software license (see LICENSE [file](https://github.com/Prometeus-Network/prometeus/blob/master/LICENSE)). Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either \express or implied.

Prometeus Network makes no representation or guarantee that this software (including any third-party libraries) will perform as intended or will be free of errors, bugs or faulty code. The software may fail which could completely or partially limit functionality or compromise computer systems. If you use or implement it, you do so at your own risk. In no event will Prometeus Network be liable to any party for any damages whatsoever, even if it had been advised of the possibility of damage.

As such this codebase should be treated as experimental and does not contain all currently developed features. Prometeus Network will be delivering regular updates.

## How it works

Ignite is a decentralized microblogging service powered by Bittorrent and public blockchain. In its essence, Ignite represents a set of independent and equitable nodes.Main features of Ignite : 

1.	It can not be blocked by any form of barrier or firewall, because it uses: 
 - BTFS engine stores ALL of its stuff and nobody can block BTT really effectively yet.
 - We use Ethereum blockchain to authenticate users and nodes and nobody can block it too! 
 - Authentication is done through blockchain; 
2.	Ignite is Immutable: data is stored forever on a distributed data storage BTFS/SOTER;
3.	Community driven: no centralized administration or governance.

All the posts texts and media attached to them are stored in the Distributed Data Storage (DDS). DDS is secure file storage for able to store necessary data and media for a period of 10-100 years. This ensures information immutability and censorship resistance. Our current version of DDS uses [Soter](https://gitlab.com/btfs_ignite). It stores all data we need to exchange between nodes. 

```
Note: speed of DDS files retrieval is far lower than what is needed to implement smooth UX. 
```
A Content Delivery Network (CDN) is used to resolve this issue. It is a geographically distributed network of proxy servers and their data centers. Its goal is to provide high availability and performance by distributing the service spatially relative to end-users. CND basically serves as a cache that is synched with DDS (which can be considered as an immutable backup in this scheme). 

To make CDN censorship-resistant as well, we use [Skynet](https://blog.sia.tech/skynet-bdf0209d6d34) (CDN presented by Sia).
Due to the blockchain nature of Ignite, authentication is done through a PROM crypto wallet (ERC20). 

## How to run

### Prerequisites

In order to run Ignite, you have to install:
- Docker. You can find installation instructions on [official website](https://docs.docker.com/install/)
- Docker-compose, which can be found [here](https://docs.docker.com/compose/install/)

### Build and run process

Firstly, you need to clone this repository with the following command:

```git clone https://github.com/Prometeus-Network/ignite-back-end.git```

#### Running inside Docker

In order to run Ignite node inside Docker container, you need to do the following:

- Create`.env` file in project's **root** directory and configure environmental variables. It is required to configure environmental 
variables to run the application. You can find their description [below](#environmental-variables).
- While in project directory, run the following command:

```docker-compose up --build``` or ```docker-compose up --build -d``` if you want to run the application in detached mode.

### Environmental variables
| Parameter                         | Type                           | Description                                                            | Required |
|-----------------------------------|--------------------------------|------------------------------------------------------------------------|----------|
| IGNITE_API_PORT                   | number                         | Port which will be used by API                                         | yes      |
| LOGGING_EVEL                      | debug \| info \| warn \| error | Level of logging verbosity                                             | no       |
| INITIAL_ACCOUNT_PRIVATE_KEY       | string                         | Private key of ETH wallet of the node                                  | yes      |
| JWT_SECRET                        | string                         | Private key for signing JWT tokens                                     | yes      |
| DATABASE_NAME                     | string                         | Name of PostgreSQL database to connect to                              | yes      |
| DATABASE_USERNAME                 | string                         | Database username which will be used for connection                    | yes      |
| DATABASE_PASSWORD                 | string                         | Database password which will be used for connection                    | yes      |
| DATABASE_HOST                     | string                         | PostgreSQL database host                                               | yes      |
| DATABASE_PORT                     | number                         | PostgreSQL database port                                               | yes      |
| RECREATE_DATABASE_SCHEMA          | boolean                        | Passed to "synchronize" option of TypeORM                              | no       |
| MIRCROBLOGGING_BLOCKCHAIN_API_URL | string                         |                                                                        | yes      |
| HOST                              | string                         | Fully qualified (schema://host:port) URL of API                        | yes      |
| MEDIA_ATTACHMENTS_DIRECTORY       | string                         | Directory which will be used to store media attachments                | yes      |
| DEFAULT_AVATAR_URL                | string                         | URL of default user avatar                                             | yes      |
| APACHE_KAFKA_PORT                 | number                         | Port which is used by Apacke Kafka. It's used to push data to BTFS     | no       |
| APACHE_KAFKA_HOST                 | string                         | Host of Apache Kafka                                                   | no       |
| ENABLE_BTFS_PUSHING               | boolean                        | Specifies whether pushing data to BTFS is enabled                      | no       |
| ENABLE_BTFS_PULLING               | boolean                        | Specifies whether pulling data from BTFS is enabled                    | no       |
| EMAIL_USERNAME                    | string                         | Username of email which is used for invites sending                    | yes      |
| EMAIL_PASSWORD                    | string                         | Password of email which is used for invites sending                    | yes      |
| EMAIL_USERNAME                    | string                         | Username of email which is used for invites sending                    | yes      |
| EMAIL_SMTP_SERVER_HOST            | string                         | Host of used SMTP server                                               | yes      |
| EMAIL_SMTP_SERVER_PORT            | number                         | Port of used SMTP server                                               | yes      |
| EMAIL_ADDRESS_TO_SEND             | string                         | Email which is used for aggregation of users submitted to private beta | yes      |
| API_HOST                          | string                         | Fully qualified (schema://host:port) URL of API                        | yes      |

## Current Stage of project

Ignite decentralized social network is now in  private beta testing stage. 

Please visit Ignite [demo page](http://beta.ignite.so/) to apply for the test account.
