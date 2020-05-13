# Subscriptions API

## Table of contents

- [Create subscription](#create-subscription)
- [Delete subscription](#delete-subscription)
- [Get subscriptions of user](#get-subscriptions-of-user)
- [Get subscriptions of current user](#get-subscriptions-of-current-user)

### Create subscription

Makes current user subscribed to the specified user. Requires
access token to be present in headers. Returns created subscription.

#### HTTP request

````
POST /api/v3/subscriptions
````

#### Request body parameters

````
{
	subscribeToAddress: string //Ethereum address of user to which current user will be subscribed
}
````

#### Response body parameters

Response contains object with the following structure:

````
{
    id: string, // ID of subscription
    createdAt: string, // ISO-formatted date of subscription creation,
    user: { 
        id: string, // ID of user to which current user subscribed
        ethereumAddress: string, // Ethereum address of user to which current user subscribed
        avatarUri?: string // Link to user's avatar image
    }
}
````

#### Sample request

````
POST /api/v3/subscriptions

{
	"subscribeToAddress": "0x86D273eF283CE2eD918c9402d75a9fF9dA51d779"
}
````

#### Sample response

````
200 OK 

{
    "id": "f8fdbf21-9fa5-4e8f-85c6-578c99207f2c",
    "createdAt": "2020-02-19T10:01:33.266Z",
    "user": {
        "avatarUri": null,
        "displayedName": "0x86D273eF283CE2eD918c9402d75a9fF9dA51d779",
        "ethereumAddress": "0x86D273eF283CE2eD918c9402d75a9fF9dA51d779",
        "id": "0x86D273eF283CE2eD918c9402d75a9fF9dA51d779",
        "remote": false
    }
}
````

#### Possible error responses

`401 UNAUTHORIZED` - Access token is expired or not present;

`409 CONFLICT` - Current user is already subscribed to user specified in request.

### Delete subscription

Deletes subscription with the specified ID. Requires access token to be present in headers.
Subscription must belong to the current user. Returns empty response with `204 NO CONTENT` status.

#### HTTP request

````
DELETE /api/v3/subscription/:id
````

#### Request parameters

`id` - ID of subscription to be deleted.

#### Sample request

````
DELETE /api/v3/subscriptions/f8fdbf21-9fa5-4e8f-85c6-578c99207f2c
````

#### Sample response

````
204 NO CONTENT
````

#### Possible error responses

`401` - Access token is expired or not present;

`403` - Subscription with the specified ID was not created by current user;

`404` - Subscription with the specified ID was not found.


### Get subscriptions of user

Returns subscriptions of user with the specified Ethereum address.

#### HTTP request

````
GET /api/v3/users/:address/subscriptions?page&pageSize
````

#### Request parameters

`address` - Ethereum address of user whose subscriptions are to be retrieved.

#### Request query parameters

`page` - page number of subscriptions, must be positive. Pagination starts with 1;

`pageSize` - how many items will be present on page, must be positive.

#### Response body parameters

Response contains array of objects with the following structure:

````
{
    id: string, // ID of subscription
    createdAt: string, // ISO-formatted date of subscription creation,
    user: { 
        id: string, // ID of user to which current user subscribed
        ethereumAddress: string, // Ethereum address of user to which current user subscribed
        avatarUri?: string // Link to user's avatar image
    }
}
````

#### Sample request

````
GET /api/v3/users/0x39875a02842372F54B50E572251a4e9dfFB0f5d8/subscriptions?page=1&pageSize=15
````

#### Sample response

````
200 OK

[
    {
        "id": "c4eea987-addf-456a-a880-9996bd59bc9f",
        "createdAt": "2020-02-19T11:40:07.278Z",
        "user": {
            "avatarUri": null,
            "displayedName": "0x86D273eF283CE2eD918c9402d75a9fF9dA51d779",
            "ethereumAddress": "0x86D273eF283CE2eD918c9402d75a9fF9dA51d779",
            "id": "0x86D273eF283CE2eD918c9402d75a9fF9dA51d779",
            "remote": false
        }
    }
]
````

### Get subscriptions of current user

Retrieves list of subscriptions of current user. Requires access token to be present in headers.

#### HTTP request

````
GET /api/v3/users/current/subscriptions?page&pageSize
````

#### Request query parameters

`page` - page number of subscriptions, must be positive. Pagination starts with 1;

`pageSize` - how many items will be present on page, must be positive.

#### Response body parameters

Response contains array of objects with the following structure:

````
{
    id: string, // ID of subscription
    createdAt: string, // ISO-formatted date of subscription creation,
    user: { 
        id: string, // ID of user to which current user subscribed
        ethereumAddress: string, // Ethereum address of user to which current user subscribed
        avatarUri?: string // Link to user's avatar image
    }
}
````

#### Sample request

````
GET /api/v3/users/current/subscriptions?page=1&pageSize=15
````

#### Sample response

````
200 OK

[
    {
        "id": "c4eea987-addf-456a-a880-9996bd59bc9f",
        "createdAt": "2020-02-19T11:40:07.278Z",
        "user": {
            "avatarUri": null,
            "displayedName": "0x86D273eF283CE2eD918c9402d75a9fF9dA51d779",
            "ethereumAddress": "0x86D273eF283CE2eD918c9402d75a9fF9dA51d779",
            "id": "0x86D273eF283CE2eD918c9402d75a9fF9dA51d779",
            "remote": false
        }
    }
]
````
