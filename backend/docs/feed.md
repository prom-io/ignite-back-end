# Feed API

## Table of contents

- [Get feed of current user](#get-feed-of-current-user)

### Get feed of current user

Retrieves feed of current user. Feed contains statuses from users
which current user is subscribed to. Requires access token to 
be present in headers.

#### HTTP request

````
GET /api/v3/feed
````

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
GET /api/v3/feed
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
        "likesCount": 1,
        "likedByCurrentUser": true,
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
        "likedByCurrentUser": false,
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
        "likedByCurrentUser": false,
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
        "likedByCurrentUser": false,
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
        "likedByCurrentUser": false,
        "text": "Hello world!"
    }
]
````

#### Possible error responses

`401 UNAUTHORIZED` - Access token is expired or not present.
