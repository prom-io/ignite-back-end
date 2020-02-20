# User profiles API

### Get profile of user

Retrieves profile of the specified user.

#### HTTP request

````
GET /api/v3/users/:address/profile
````

#### Request parameters

`address` - ethereum address of user whose profile is to be retrieved;

#### Response body parameters

Response contains object with the following structure:

````
{
    avatarUri?: string, // link to user's avatar
    id: string, // ID of user,
    ethereumAddress: string, // Ethereum address of user
    stats: { // object containing info about profile stats
        followersCount: number, // number of followers of this user
        followsCount: number, // number of users followed by this user
        statusesCount: number // number of statuses created by this user
    },
    currentUserSubscriptionId?: string // If current user is subscribed to this user, this field contains ID of subscription
}
````

#### Sample request

````
GET /api/v3/users/0x9d0733391f6c7dbAcE6E71cFA6D0fBf077f8b3d9/profile
````

#### Sample response

````
200 OK

{
    "avatarUri": null,
    "displayedName": "0x9d0733391f6c7dbAcE6E71cFA6D0fBf077f8b3d9",
    "ethereumAddress": "0x9d0733391f6c7dbAcE6E71cFA6D0fBf077f8b3d9",
    "id": "0x9d0733391f6c7dbAcE6E71cFA6D0fBf077f8b3d9",
    "remote": false,
    "stats": {
        "followersCount": 1,
        "followsCount": 0,
        "statusesCount": 2
    },
    "currentUserSubscriptionId": "3c43e817-430f-4e6f-a317-4b5a51a46e74"
}
````

#### Possible error responses

`401` - access token is either invalid or expired;

`404` - user with the specified address was not found.


### Get profile of current user

Retrieves profile of current user. Requires access token to be present in headers.

#### HTTP request

````
GET /api/v3/users/current/profile
````

#### Response body parameters

Response contains object with the following structure:

````
{
    avatarUri?: string, // link to user's avatar
    id: string, // ID of user,
    ethereumAddress: string, // Ethereum address of user
    stats: { // object containing info about profile stats
        followersCount: number, // number of followers of this user
        followsCount: number, // number of users followed by this user
        statusesCount: number // number of statuses created by this user
    }
}
````

#### Sample request

````
GET /api/v3/users/current/profile
````

#### Sample response

````
200 OK

{
    "avatarUri": null,
    "displayedName": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
    "ethereumAddress": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
    "id": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
    "remote": false,
    "stats": {
        "followersCount": 0,
        "followsCount": 1,
        "statusesCount": 0
    }
}
````
