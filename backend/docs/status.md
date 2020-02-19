# Statuses API

## Table of contents

- [Create new status](#create-new-status)
- [Get statuses of current user](#get-statuses-of-current-user)
- [Get statuses of specific user](#get-statuses-of-specific-user)
- [Get status by ID](#get-status-by-id)

### Create new status

Creates new status. Requires access token to be present in headers.
Returns created status.

#### HTTP request

````
POST /api/v3/statuses
````

#### Request body parameters

````
{
    text: string // Text of status
}
````

#### Response body parameters

````
{
    id: string, // ID of created status
    createdAt: string, // ISO-formatted date of status creation
    text: string, // Text of created status
    likesCount: number, // Number of likes
    author: {
        id: string, // ID of user who created post,
        ethereumAddress: string, // Ethereum address of user who created post
        avatarUri?: string // Link to user's avatar image
    }
}
````

#### Sample request

````
POST /api/v3/statuses

{
	"text": "Decentralized microblogging"
}
````

#### Sample response

````
201 CREATED

{
    "author": {
        "avatarUri": null,
        "displayedName": "0x39875a02842372F54B50E572251a4e9dfFB0f5d8",
        "ethereumAddress": "0x39875a02842372F54B50E572251a4e9dfFB0f5d8",
        "id": "0x39875a02842372F54B50E572251a4e9dfFB0f5d8",
        "remote": false
    },
    "createdAt": "2020-02-18T17:25:09.570Z",
    "id": "745bad6f-017b-4de9-8eac-5f0bf60ccd49",
    "likesCount": 0,
    "text": "Decentralized microblogging"
}
````

### Get statuses of current user

Returns statuses of current user. Requires access token to be present.

#### HTTP request

````
GET /api/v3/users/current/statuses?page&pageSize
````

#### Request query parameters

`page` - Page to start with. Pagination starts with 1;

`pageSize` - Page size, must be positive.

#### Response body parameters

Response body contains array of objects with the following structure:

````
{
    id: string, // ID of status
    createdAt: string, // ISO-formatted date of status creation
    text: string, // Text of status
    likesCount: number, // Number of likes
    author: {
        id: string, // ID of user who created post,
        ethereumAddress: string, // Ethereum address of user who created post
        avatarUri?: string // Link to user's avatar image
    }
}
````

#### Sample request

```
GET /api/v3/users/current/statuses?page=1&pageSize=30
```

#### Sample response

````
200 OK

[
    {
        "author": {
            "avatarUri": null,
            "displayedName": "0x39875a02842372F54B50E572251a4e9dfFB0f5d8",
            "ethereumAddress": "0x39875a02842372F54B50E572251a4e9dfFB0f5d8",
            "id": "0x39875a02842372F54B50E572251a4e9dfFB0f5d8",
            "remote": false
        },
        "createdAt": "2020-02-18T17:25:09.570Z",
        "id": "745bad6f-017b-4de9-8eac-5f0bf60ccd49",
        "likesCount": 0,
        "text": "Decentralized microblogging"
    },
    {
        "author": {
            "avatarUri": null,
            "displayedName": "0x39875a02842372F54B50E572251a4e9dfFB0f5d8",
            "ethereumAddress": "0x39875a02842372F54B50E572251a4e9dfFB0f5d8",
            "id": "0x39875a02842372F54B50E572251a4e9dfFB0f5d8",
            "remote": false
        },
        "createdAt": "2020-02-18T17:05:20.689Z",
        "id": "5ffdc359-fa23-4693-87e2-253b6f5f2e4b",
        "likesCount": 0,
        "text": "Decentralized twitter!!"
    },
    {
        "author": {
            "avatarUri": null,
            "displayedName": "0x39875a02842372F54B50E572251a4e9dfFB0f5d8",
            "ethereumAddress": "0x39875a02842372F54B50E572251a4e9dfFB0f5d8",
            "id": "0x39875a02842372F54B50E572251a4e9dfFB0f5d8",
            "remote": false
        },
        "createdAt": "2020-02-18T17:04:44.218Z",
        "id": "ce2e7acf-4a8e-4130-8192-af5c21d888e5",
        "likesCount": 0,
        "text": "Decentralized twitter!"
    },
    {
        "author": {
            "avatarUri": null,
            "displayedName": "0x39875a02842372F54B50E572251a4e9dfFB0f5d8",
            "ethereumAddress": "0x39875a02842372F54B50E572251a4e9dfFB0f5d8",
            "id": "0x39875a02842372F54B50E572251a4e9dfFB0f5d8",
            "remote": false
        },
        "createdAt": "2020-02-18T17:04:27.401Z",
        "id": "f6130cac-d609-41e9-9794-395c81f12dfd",
        "likesCount": 0,
        "text": "test1323232323"
    },
    {
        "author": {
            "avatarUri": null,
            "displayedName": "0x39875a02842372F54B50E572251a4e9dfFB0f5d8",
            "ethereumAddress": "0x39875a02842372F54B50E572251a4e9dfFB0f5d8",
            "id": "0x39875a02842372F54B50E572251a4e9dfFB0f5d8",
            "remote": false
        },
        "createdAt": "2020-02-18T17:03:33.144Z",
        "id": "f6808f83-5820-49bc-89bc-53f5300496dd",
        "likesCount": 0,
        "text": "test1323232323"
    },
    {
        "author": {
            "avatarUri": null,
            "displayedName": "0x39875a02842372F54B50E572251a4e9dfFB0f5d8",
            "ethereumAddress": "0x39875a02842372F54B50E572251a4e9dfFB0f5d8",
            "id": "0x39875a02842372F54B50E572251a4e9dfFB0f5d8",
            "remote": false
        },
        "createdAt": "2020-02-18T17:02:50.200Z",
        "id": "735ce86b-7bea-4eaf-934b-59b2f3ead49f",
        "likesCount": 0,
        "text": "test1323232323"
    }
]
````

### Get statuses of specific user

Returns statuses of user with the specified Ethereum address.

#### HTTP request

````
GET /api/v3/users/:address/statues?page&pageSize
````

#### Request parameters

`address` - Ethereum address of user whose statuses to be retrieved.

#### Request query parameters

`page` - Page to start with. Pagination starts with 1;

`pageSize` - Page size, must be positive.

#### Response body parameters

#### Response body parameters

Response body contains array of objects with the following structure:

````
{
    id: string, // ID of status
    createdAt: string, // ISO-formatted date of status creation
    text: string, // Text of status
    likesCount: number, // Number of likes
    author: {
        id: string, // ID of user who created post,
        ethereumAddress: string, // Ethereum address of user who created post
        avatarUri?: string // Link to user's avatar image
    }
}
````

#### Sample request

````
GET /api/v3/users/0x86D273eF283CE2eD918c9402d75a9fF9dA51d779/statuses?page=1&pageSize=30
````

#### Sample response

````
200 OK

[
    {
        "author": {
            "avatarUri": null,
            "displayedName": "0x86D273eF283CE2eD918c9402d75a9fF9dA51d779",
            "ethereumAddress": "0x86D273eF283CE2eD918c9402d75a9fF9dA51d779",
            "id": "0x86D273eF283CE2eD918c9402d75a9fF9dA51d779",
            "remote": false
        },
        "createdAt": "2020-02-18T16:56:58.387Z",
        "id": "d26c7ea5-5c66-421e-8387-dec0271d67b8",
        "likesCount": 0,
        "text": "test1323232323"
    },
    {
        "author": {
            "avatarUri": null,
            "displayedName": "0x86D273eF283CE2eD918c9402d75a9fF9dA51d779",
            "ethereumAddress": "0x86D273eF283CE2eD918c9402d75a9fF9dA51d779",
            "id": "0x86D273eF283CE2eD918c9402d75a9fF9dA51d779",
            "remote": false
        },
        "createdAt": "2020-02-18T16:54:11.791Z",
        "id": "6a8888c7-a6f4-4070-a4fd-72c2d25586e9",
        "likesCount": 0,
        "text": "test"
    },
    {
        "author": {
            "avatarUri": null,
            "displayedName": "0x86D273eF283CE2eD918c9402d75a9fF9dA51d779",
            "ethereumAddress": "0x86D273eF283CE2eD918c9402d75a9fF9dA51d779",
            "id": "0x86D273eF283CE2eD918c9402d75a9fF9dA51d779",
            "remote": false
        },
        "createdAt": "2020-02-18T16:46:10.633Z",
        "id": "5e39ec5e-847d-43d2-9b83-1ba3b6493047",
        "likesCount": 0,
        "text": "Hello world!"
    },
    {
        "author": {
            "avatarUri": null,
            "displayedName": "0x86D273eF283CE2eD918c9402d75a9fF9dA51d779",
            "ethereumAddress": "0x86D273eF283CE2eD918c9402d75a9fF9dA51d779",
            "id": "0x86D273eF283CE2eD918c9402d75a9fF9dA51d779",
            "remote": false
        },
        "createdAt": "2020-02-18T16:39:11.757Z",
        "id": "c36401f7-6ca2-4c7f-aa09-8f2b6558e662",
        "likesCount": 0,
        "text": "Hello world!"
    },
    {
        "author": {
            "avatarUri": null,
            "displayedName": "0x86D273eF283CE2eD918c9402d75a9fF9dA51d779",
            "ethereumAddress": "0x86D273eF283CE2eD918c9402d75a9fF9dA51d779",
            "id": "0x86D273eF283CE2eD918c9402d75a9fF9dA51d779",
            "remote": false
        },
        "createdAt": "2020-02-18T16:36:43.689Z",
        "id": "b2277545-2efd-41cb-9cc8-3e4b1164fdd2",
        "likesCount": 0,
        "text": "Hello world!"
    }
]
````

#### Get status by ID

Returns status with the specified id.

#### HTTP request

````
GET /api/v3/statuses/:id
````

#### Request parameters

`id` - ID of status to be retrieved

#### Response body parameters

Object with the following structure is returned:

````
{
    id: string, // ID of status
    createdAt: string, // ISO-formatted date of status creation
    text: string, // Text of status
    likesCount: number, // Number of likes
    author: {
        id: string, // ID of user who created post,
        ethereumAddress: string, // Ethereum address of user who created post
        avatarUri?: string // Link to user's avatar image
    }
}
````

#### Sample request

````
GET /api/v3/statuses/d26c7ea5-5c66-421e-8387-dec0271d67b8
````

#### Sample response

````
200 OK

{
    "author": {
        "avatarUri": null,
        "displayedName": "0x86D273eF283CE2eD918c9402d75a9fF9dA51d779",
        "ethereumAddress": "0x86D273eF283CE2eD918c9402d75a9fF9dA51d779",
        "id": "0x86D273eF283CE2eD918c9402d75a9fF9dA51d779",
        "remote": false
    },
    "createdAt": "2020-02-18T16:56:58.387Z",
    "id": "d26c7ea5-5c66-421e-8387-dec0271d67b8",
    "likesCount": 0,
    "text": "test1323232323"
}
````
