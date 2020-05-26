# Accounts api

### Get account by address

Returns account by its Ethereum address.

#### HTTP Request

````
GET /api/v1/account_by_username/:address
````

#### Request parameters

| Parameter | Type   | Description                              | Required |
|-----------|--------|------------------------------------------|----------|
| address   | string | Ethereum address of user to be retrieved | yes      |

#### Response

Returns response of [Account](#https://github.com/Prometeus-Network/ignite-back-end/blob/master/docs/api-entities.md#account) type.

#### Sample request

````
/api/v1/account_by_username/0x3571Ff26ff3c151ce85273bC76a16a5539F0FC93
````

#### Sample response

````
{
    "emojis": [],
    "note": "",
    "fields": [],
    "avatar": "http://178.128.240.29:3004/api/v1/media/f7b35449-60ff-4eb9-a6c0-59ad0d87ada8.jpg",
    "display_name": "Hero Knight",
    "acct": "Hero Knight",
    "id": "0x3571Ff26ff3c151ce85273bC76a16a5539F0FC93",
    "avatar_static": null,
    "created_at": "2020-05-01T13:32:26.092Z",
    "followers_count": 12,
    "follows_count": 28,
    "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
    "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
    "username": "Hero",
    "remote": false,
    "statuses_count": 177,
    "following": false,
    "followed_by": false,
    "bio": "Your next door neighbour, stylish character with an extraordinary attitude. "
}
````

### Follow user

Subscribes current user to the specified user. 

#### HTTP Request

````
POST /api/v1/accounts/:address/follow
````

#### Request parameters

| Parameter | Type   | Description                              | Required |
|-----------|--------|------------------------------------------|----------|
| address   | string | Ethereum address of user to be follow    | yes      |

#### Response

Returns response of [Account](#https://github.com/Prometeus-Network/ignite-back-end/blob/master/docs/api-entities.md#account) type.

#### Sample request

````
POST /api/v1/accounts/0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d/follow
````

#### Sample response

````
{
    "emojis": [],
    "note": "",
    "fields": [],
    "avatar": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
    "display_name": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
    "acct": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
    "id": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
    "avatar_static": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
    "created_at": "2020-02-24T08:38:05.523Z",
    "followers_count": 2,
    "follows_count": 9,
    "header": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
    "header_static": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
    "username": "Kehlani",
    "remote": false,
    "statuses_count": 56,
    "following": true,
    "followed_by": true,
    "bio": null
}
````

### Unfollow user

Unsubscribes current user from the specified user.

#### HTTP Request

````
POST /api/v1/accounts/:address/unfollow
````

#### Request parameters

| Parameter | Type   | Description                                  | Required |
|-----------|--------|----------------------------------------------|----------|
| address   | string | Ethereum address of user to be unfollowed    | yes      |

#### Response

Returns response of [Account](#https://github.com/Prometeus-Network/ignite-back-end/blob/master/docs/api-entities.md#account) type.

#### Sample request

````
POST /api/v1/accounts/0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d/unfollow
````

#### Sample response

````
{
    "emojis": [],
    "note": "",
    "fields": [],
    "avatar": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
    "display_name": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
    "acct": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
    "id": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
    "avatar_static": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
    "created_at": "2020-02-24T08:38:05.523Z",
    "followers_count": 2,
    "follows_count": 9,
    "header": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
    "header_static": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
    "username": "Kehlani",
    "remote": false,
    "statuses_count": 56,
    "following": false,
    "followed_by": true,
    "bio": null
}
````

### Get followers of user

Returns followers of the specified

#### HTTP request

````
GET /api/v1/accounts/:address/followers
````

#### Request parameters

| Parameter | Type   | Description                                  | Required |
|-----------|--------|----------------------------------------------|----------|
| address   | string | Ethereum address of user                     | yes      |

#### Response

Returns array of [Account](#https://github.com/Prometeus-Network/ignite-back-end/blob/master/docs/api-entities.md#account) type.

#### Sample response

````
[
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/f7b35449-60ff-4eb9-a6c0-59ad0d87ada8.jpg",
        "display_name": "Hero Knight",
        "acct": "Hero Knight",
        "id": "0x3571Ff26ff3c151ce85273bC76a16a5539F0FC93",
        "avatar_static": null,
        "created_at": "2020-05-01T13:32:26.092Z",
        "followers_count": 13,
        "follows_count": 28,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "Hero",
        "remote": false,
        "statuses_count": 179,
        "following": false,
        "followed_by": false,
        "bio": "Your next door neighbour, stylish character with an extraordinary attitude. "
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/722ef3d1-64d0-4dce-ab7c-48d26e0de02d.png",
        "display_name": "지나 ㅇㅅㅇ",
        "acct": "지나 ㅇㅅㅇ",
        "id": "0xDC1eEBab2fcE04302A07A9034ffe0cE60bDBb221",
        "avatar_static": null,
        "created_at": "2020-05-01T13:48:45.775Z",
        "followers_count": 29,
        "follows_count": 31,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "지나ㅇㅅㅇ",
        "remote": false,
        "statuses_count": 36,
        "following": false,
        "followed_by": false,
        "bio": "우리집 사랑해 우리 남친도 "
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29/default_user.png",
        "display_name": "0x91009494bbdda9993AB8AB4eda811231BCD9e110",
        "acct": "0x91009494bbdda9993AB8AB4eda811231BCD9e110",
        "id": "0x91009494bbdda9993AB8AB4eda811231BCD9e110",
        "avatar_static": null,
        "created_at": "2020-05-18T03:36:25.050Z",
        "followers_count": 0,
        "follows_count": 115,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "0x91009494bbdda9993AB8AB4eda811231BCD9e110",
        "remote": false,
        "statuses_count": 0,
        "following": false,
        "followed_by": false,
        "bio": null
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/9e3f9a94-d738-4482-8b3b-d79e138979c4.png",
        "display_name": "Vlad Semenovs",
        "acct": "Vlad Semenovs",
        "id": "0xa0302924b7708829Ba6332249C1fA226A5656dAf",
        "avatar_static": null,
        "created_at": "2020-05-12T15:35:18.174Z",
        "followers_count": 27,
        "follows_count": 2,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "vlad",
        "remote": false,
        "statuses_count": 3,
        "following": false,
        "followed_by": false,
        "bio": null
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/1a1cb334-162e-40fd-9c96-79a56929959d.jpg",
        "display_name": "Nipun",
        "acct": "Nipun",
        "id": "0xAD1fCd37cC497e7353b7a1D6770C9b67F6FF30dd",
        "avatar_static": null,
        "created_at": "2020-05-01T12:49:56.944Z",
        "followers_count": 16,
        "follows_count": 25,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "NipunP",
        "remote": false,
        "statuses_count": 132,
        "following": false,
        "followed_by": false,
        "bio": "Banker/ Government Banking/ Businessman"
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29/default_user.png",
        "display_name": "0x17De7F25676F5f8207261bb06E90364381c10529",
        "acct": "0x17De7F25676F5f8207261bb06E90364381c10529",
        "id": "0x17De7F25676F5f8207261bb06E90364381c10529",
        "avatar_static": null,
        "created_at": "2020-05-18T03:22:06.941Z",
        "followers_count": 0,
        "follows_count": 136,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "0x17De7F25676F5f8207261bb06E90364381c10529",
        "remote": false,
        "statuses_count": 0,
        "following": false,
        "followed_by": false,
        "bio": null
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/c6d7a22e-1579-4a08-a371-dbdc9f9a39e3.jpg",
        "display_name": "John",
        "acct": "John",
        "id": "0xCa285598528a94F634A90581C2E38d1283a9b20A",
        "avatar_static": null,
        "created_at": "2020-05-01T12:43:45.779Z",
        "followers_count": 13,
        "follows_count": 22,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "John",
        "remote": false,
        "statuses_count": 147,
        "following": false,
        "followed_by": false,
        "bio": "Badass"
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/364758a6-7eb9-4621-ab48-463ae901c254.jpg",
        "display_name": "Shashi",
        "acct": "Shashi",
        "id": "0xE8B0BA544eAdC69907BE3A4be683f46187aC0b4f",
        "avatar_static": null,
        "created_at": "2020-05-01T12:42:29.044Z",
        "followers_count": 14,
        "follows_count": 23,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "ShashiB",
        "remote": false,
        "statuses_count": 143,
        "following": false,
        "followed_by": false,
        "bio": "Crypto Investor/ Technical Analyst/  Quality stock investor"
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/829cdf4d-ee72-40a8-bfe3-8a4ff6824886.jpg",
        "display_name": "Spiky jerry",
        "acct": "Spiky jerry",
        "id": "0xE27E6b9426C94723097E04B91D36e24F4a6D02F6",
        "avatar_static": null,
        "created_at": "2020-05-01T12:40:10.282Z",
        "followers_count": 13,
        "follows_count": 20,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "Spikyjerry",
        "remote": false,
        "statuses_count": 139,
        "following": false,
        "followed_by": false,
        "bio": "Your biggest competition is yourself, Beatup that loser."
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/19ba3668-a5ba-4474-9fca-d55de75565a9.jpg",
        "display_name": "Handa",
        "acct": "Handa",
        "id": "0x4e78d467A478F607ecC072C6f8C04Fe53ad041Fb",
        "avatar_static": null,
        "created_at": "2020-05-01T12:44:31.509Z",
        "followers_count": 11,
        "follows_count": 20,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "Handa",
        "remote": false,
        "statuses_count": 147,
        "following": false,
        "followed_by": false,
        "bio": "passionate civil engineer"
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/c3af6875-4f43-4dd6-ad6f-7ca5dc604085.jpg",
        "display_name": "Manu Sharma",
        "acct": "Manu Sharma",
        "id": "0xDb615a1433A07ee54eF5dcc2430ce43E540f4B61",
        "avatar_static": null,
        "created_at": "2020-05-01T12:47:29.996Z",
        "followers_count": 13,
        "follows_count": 28,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "SharmaG",
        "remote": false,
        "statuses_count": 135,
        "following": false,
        "followed_by": false,
        "bio": "Stylist/ Brand marketing/ Online Marketing"
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/cefc0de0-6755-4889-8eff-152569bc6510.jpg",
        "display_name": "Stuart",
        "acct": "Stuart",
        "id": "0xC374db3fFb84D009BE1086B3623628e1b27960e1",
        "avatar_static": null,
        "created_at": "2020-05-01T12:50:42.616Z",
        "followers_count": 16,
        "follows_count": 31,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "Stuartlittle",
        "remote": false,
        "statuses_count": 139,
        "following": false,
        "followed_by": false,
        "bio": "Enterpreneur/ Environment Engineer/Water treatment specialist"
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/34724d4f-e77f-483f-8f86-295d343ea08e.jpg",
        "display_name": "Navi Gaba",
        "acct": "Navi Gaba",
        "id": "0x4d77aF3955C9ba827fefD5D9bE6c8A1486552D39",
        "avatar_static": null,
        "created_at": "2020-05-12T15:08:11.747Z",
        "followers_count": 13,
        "follows_count": 21,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "NGaba",
        "remote": false,
        "statuses_count": 91,
        "following": false,
        "followed_by": false,
        "bio": null
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/05f3beb5-8a9c-4886-aa60-655c36716481.jpg",
        "display_name": "Naitik Bassi",
        "acct": "Naitik Bassi",
        "id": "0x9d55E4a6AeAE8AAB4ba04733084dA7b10096AD05",
        "avatar_static": null,
        "created_at": "2020-05-01T12:39:25.745Z",
        "followers_count": 81,
        "follows_count": 23,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "Naitikk",
        "remote": false,
        "statuses_count": 158,
        "following": false,
        "followed_by": false,
        "bio": "Crypto Community Manager/ Non technical/ Marketing Assistant"
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/0606ba9c-eedf-4322-962e-f117a40d8ad1.jpg",
        "display_name": "Tracey Murray",
        "acct": "Tracey Murray",
        "id": "0x31962AD0879a75c9A6C16C3492C34e71E55Aba49",
        "avatar_static": null,
        "created_at": "2020-05-20T19:47:39.265Z",
        "followers_count": 0,
        "follows_count": 7,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "kapsmur",
        "remote": false,
        "statuses_count": 21,
        "following": false,
        "followed_by": false,
        "bio": null
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/b50ac71a-6144-4b48-8618-9bfe2c91ec82.png",
        "display_name": "Seb Gutierrez",
        "acct": "Seb Gutierrez",
        "id": "0xe6179C862AFeEd742Ff0423f81cc47F31E60ad5C",
        "avatar_static": null,
        "created_at": "2020-05-20T19:47:37.458Z",
        "followers_count": 1,
        "follows_count": 5,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "zerres",
        "remote": false,
        "statuses_count": 23,
        "following": false,
        "followed_by": false,
        "bio": null
    }
]
````

### Get following of user

Returns array of users which are followed by the specified user

#### HTTP request

````
GET /api/v1/accounts/:address/following
````

#### Request parameters

| Parameter | Type   | Description                                  | Required |
|-----------|--------|----------------------------------------------|----------|
| address   | string | Ethereum address of user                     | yes      |

#### Response

Returns array of [Account](#https://github.com/Prometeus-Network/ignite-back-end/blob/master/docs/api-entities.md#account) type.

#### Sample request

````
GET /api/v1/accounts/0x41057b2DC593517e531b355811Cd479E34a9d8B5/following
````

#### Sample response

````
[
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/cce73fdb-a031-457d-aed5-d1511ac40691.png",
        "display_name": "Ignite Official",
        "acct": "Ignite Official",
        "id": "0x829EAa2c551c3f43681D3B7B2dad165e122C4922",
        "avatar_static": null,
        "created_at": "2020-05-12T15:37:34.913Z",
        "followers_count": 0,
        "follows_count": 0,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "ignite_official",
        "remote": false,
        "statuses_count": 0,
        "following": false,
        "followed_by": false,
        "bio": null
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/829cdf4d-ee72-40a8-bfe3-8a4ff6824886.jpg",
        "display_name": "Spiky jerry",
        "acct": "Spiky jerry",
        "id": "0xE27E6b9426C94723097E04B91D36e24F4a6D02F6",
        "avatar_static": null,
        "created_at": "2020-05-01T12:40:10.282Z",
        "followers_count": 0,
        "follows_count": 0,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "Spikyjerry",
        "remote": false,
        "statuses_count": 0,
        "following": false,
        "followed_by": false,
        "bio": "Your biggest competition is yourself, Beatup that loser."
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/05f3beb5-8a9c-4886-aa60-655c36716481.jpg",
        "display_name": "Naitik Bassi",
        "acct": "Naitik Bassi",
        "id": "0x9d55E4a6AeAE8AAB4ba04733084dA7b10096AD05",
        "avatar_static": null,
        "created_at": "2020-05-01T12:39:25.745Z",
        "followers_count": 0,
        "follows_count": 0,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "Naitikk",
        "remote": false,
        "statuses_count": 0,
        "following": false,
        "followed_by": false,
        "bio": "Crypto Community Manager/ Non technical/ Marketing Assistant"
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/cefc0de0-6755-4889-8eff-152569bc6510.jpg",
        "display_name": "Stuart",
        "acct": "Stuart",
        "id": "0xC374db3fFb84D009BE1086B3623628e1b27960e1",
        "avatar_static": null,
        "created_at": "2020-05-01T12:50:42.616Z",
        "followers_count": 0,
        "follows_count": 0,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "Stuartlittle",
        "remote": false,
        "statuses_count": 0,
        "following": false,
        "followed_by": false,
        "bio": "Enterpreneur/ Environment Engineer/Water treatment specialist"
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/d43a861a-ce1d-4d67-8bea-029e2477c7ca.jpg",
        "display_name": "The Real Don Rickels",
        "acct": "The Real Don Rickels",
        "id": "0xaf5B5b2298E1de410b8E5A6505C5A64CFB52e2d8",
        "avatar_static": null,
        "created_at": "2020-05-12T15:37:31.454Z",
        "followers_count": 0,
        "follows_count": 0,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "Realdonrickels",
        "remote": false,
        "statuses_count": 0,
        "following": false,
        "followed_by": false,
        "bio": "You will be Entertained "
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/c6d7a22e-1579-4a08-a371-dbdc9f9a39e3.jpg",
        "display_name": "John",
        "acct": "John",
        "id": "0xCa285598528a94F634A90581C2E38d1283a9b20A",
        "avatar_static": null,
        "created_at": "2020-05-01T12:43:45.779Z",
        "followers_count": 0,
        "follows_count": 0,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "John",
        "remote": false,
        "statuses_count": 0,
        "following": false,
        "followed_by": false,
        "bio": "Badass"
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/e5915792-a3c3-4e26-b6f0-d554a45b0d32.jpg",
        "display_name": "Thomas Berger",
        "acct": "Thomas Berger",
        "id": "0x0B0b424AD029c7e275Df1F2b9fd0476c0BBED296",
        "avatar_static": null,
        "created_at": "2020-05-01T13:03:00.485Z",
        "followers_count": 0,
        "follows_count": 0,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "ThomasBerger",
        "remote": false,
        "statuses_count": 0,
        "following": false,
        "followed_by": false,
        "bio": null
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/c860e5c8-14eb-457a-a451-8a91ed31305f.png",
        "display_name": "",
        "acct": "",
        "id": "0x5918DF6b9901A316Aa6d19EF72b3F78665340329",
        "avatar_static": null,
        "created_at": "2020-05-12T15:35:01.855Z",
        "followers_count": 0,
        "follows_count": 0,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "1",
        "remote": false,
        "statuses_count": 0,
        "following": false,
        "followed_by": false,
        "bio": null
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/c3af6875-4f43-4dd6-ad6f-7ca5dc604085.jpg",
        "display_name": "Manu Sharma",
        "acct": "Manu Sharma",
        "id": "0xDb615a1433A07ee54eF5dcc2430ce43E540f4B61",
        "avatar_static": null,
        "created_at": "2020-05-01T12:47:29.996Z",
        "followers_count": 0,
        "follows_count": 0,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "SharmaG",
        "remote": false,
        "statuses_count": 0,
        "following": false,
        "followed_by": false,
        "bio": "Stylist/ Brand marketing/ Online Marketing"
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/34724d4f-e77f-483f-8f86-295d343ea08e.jpg",
        "display_name": "Navi Gaba",
        "acct": "Navi Gaba",
        "id": "0x4d77aF3955C9ba827fefD5D9bE6c8A1486552D39",
        "avatar_static": null,
        "created_at": "2020-05-12T15:08:11.747Z",
        "followers_count": 0,
        "follows_count": 0,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "NGaba",
        "remote": false,
        "statuses_count": 0,
        "following": false,
        "followed_by": false,
        "bio": null
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/19ba3668-a5ba-4474-9fca-d55de75565a9.jpg",
        "display_name": "Handa",
        "acct": "Handa",
        "id": "0x4e78d467A478F607ecC072C6f8C04Fe53ad041Fb",
        "avatar_static": null,
        "created_at": "2020-05-01T12:44:31.509Z",
        "followers_count": 0,
        "follows_count": 0,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "Handa",
        "remote": false,
        "statuses_count": 0,
        "following": false,
        "followed_by": false,
        "bio": "passionate civil engineer"
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/364758a6-7eb9-4621-ab48-463ae901c254.jpg",
        "display_name": "Shashi",
        "acct": "Shashi",
        "id": "0xE8B0BA544eAdC69907BE3A4be683f46187aC0b4f",
        "avatar_static": null,
        "created_at": "2020-05-01T12:42:29.044Z",
        "followers_count": 0,
        "follows_count": 0,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "ShashiB",
        "remote": false,
        "statuses_count": 0,
        "following": false,
        "followed_by": false,
        "bio": "Crypto Investor/ Technical Analyst/  Quality stock investor"
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/1a1cb334-162e-40fd-9c96-79a56929959d.jpg",
        "display_name": "Nipun",
        "acct": "Nipun",
        "id": "0xAD1fCd37cC497e7353b7a1D6770C9b67F6FF30dd",
        "avatar_static": null,
        "created_at": "2020-05-01T12:49:56.944Z",
        "followers_count": 0,
        "follows_count": 0,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "NipunP",
        "remote": false,
        "statuses_count": 0,
        "following": false,
        "followed_by": false,
        "bio": "Banker/ Government Banking/ Businessman"
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/ebf5ca5a-3815-4186-a4e5-7cd7608299f6.jpg",
        "display_name": "Kendrick McCarthur",
        "acct": "Kendrick McCarthur",
        "id": "0x22203c8A044099B2Ead65d154b3Bd07d1c5E9C95",
        "avatar_static": null,
        "created_at": "2020-05-01T12:25:40.305Z",
        "followers_count": 0,
        "follows_count": 0,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "KMcCarthur",
        "remote": false,
        "statuses_count": 0,
        "following": false,
        "followed_by": false,
        "bio": "Business developer| Market Researcher| per-time crypto trader| not a maximalist| Privacy coin lover"
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/9cf57ab3-d698-4ddc-8585-bef19547a511.jpg",
        "display_name": "Sopuruchi Richard",
        "acct": "Sopuruchi Richard",
        "id": "0x5649f03CB71D23b24b39a00457e44100fe174779",
        "avatar_static": null,
        "created_at": "2020-05-01T12:33:10.042Z",
        "followers_count": 0,
        "follows_count": 0,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "SoRich",
        "remote": false,
        "statuses_count": 0,
        "following": false,
        "followed_by": false,
        "bio": "Entrepreneur| Investor| Motivator| Life coach| Transforming life is all I do."
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/d17272ac-1149-4467-830c-ae77833a6377.jpg",
        "display_name": "Eva Rudiger",
        "acct": "Eva Rudiger",
        "id": "0x30514Cd15EbCAD87CDa627Cc7136ba6Ac90c1d5c",
        "avatar_static": null,
        "created_at": "2020-05-01T12:17:03.991Z",
        "followers_count": 0,
        "follows_count": 0,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "EvaRu",
        "remote": false,
        "statuses_count": 0,
        "following": false,
        "followed_by": false,
        "bio": "Landscape Architect in training| Environmental activist| Vegan| Orchard Enthusiast, Nature is my nature🌲🌷"
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/e0a66327-8256-4972-a949-eb78bb2f8645.jpg",
        "display_name": "Sheronda Kelly",
        "acct": "Sheronda Kelly",
        "id": "0xA153188ce14D8e9E5bf3Ee896890CBBBc35E6277",
        "avatar_static": null,
        "created_at": "2020-05-01T12:15:19.869Z",
        "followers_count": 0,
        "follows_count": 0,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "SherondaKelly",
        "remote": false,
        "statuses_count": 0,
        "following": false,
        "followed_by": false,
        "bio": "Nutritionist, passionate about organic and ethical health| Fitness Enthusiast| I like plants"
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/3eec0843-181e-414c-b265-d486c7adef01.jpg",
        "display_name": "Katherine Esslinger",
        "acct": "Katherine Esslinger",
        "id": "0x7bb66ca1c6aeDdD66Ac851aCf398959404666892",
        "avatar_static": null,
        "created_at": "2020-05-01T12:27:37.349Z",
        "followers_count": 0,
        "follows_count": 0,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "KatEss",
        "remote": false,
        "statuses_count": 0,
        "following": false,
        "followed_by": false,
        "bio": "Pharmacist| Dancer| Beat Aficionado| Culture Seeker"
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/bd687add-7306-438f-9e4b-dbffb0249966.png",
        "display_name": "Alex Shishow",
        "acct": "Alex Shishow",
        "id": "0x95Ccc15a3a991109C8E22c171B2A4880D9C37E6c",
        "avatar_static": null,
        "created_at": "2020-05-12T15:37:33.975Z",
        "followers_count": 0,
        "follows_count": 0,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "alex_shishow",
        "remote": false,
        "statuses_count": 0,
        "following": false,
        "followed_by": false,
        "bio": null
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/783b42f1-944b-4638-866d-0827b3c09869.jpg",
        "display_name": "Erika Joel",
        "acct": "Erika Joel",
        "id": "0xe1C7190f53120162f4F4F624BeA7e621dAc9Be19",
        "avatar_static": null,
        "created_at": "2020-05-01T12:38:05.664Z",
        "followers_count": 0,
        "follows_count": 0,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "JoJoErika",
        "remote": false,
        "statuses_count": 0,
        "following": false,
        "followed_by": false,
        "bio": "Crypto Lover|Song writer| MusicianStudio Singer"
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/d0d4bf86-2af1-4659-b0d4-e56fae462762.jpg",
        "display_name": "Kofi Nyantakyi",
        "acct": "Kofi Nyantakyi",
        "id": "0x5E05eC4befd4f5F681341e57621746B5f0219203",
        "avatar_static": null,
        "created_at": "2020-05-01T12:35:22.154Z",
        "followers_count": 0,
        "follows_count": 0,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "NKofi",
        "remote": false,
        "statuses_count": 0,
        "following": false,
        "followed_by": false,
        "bio": "Data scientist| writer| lover of Astrology| continuous learner"
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/2fc23122-af2a-4726-9950-4401c4d85483.jpg",
        "display_name": "Lorenze Lefforge'",
        "acct": "Lorenze Lefforge'",
        "id": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
        "avatar_static": null,
        "created_at": "2020-05-01T12:13:06.536Z",
        "followers_count": 0,
        "follows_count": 0,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "LorenzeLefforge",
        "remote": false,
        "statuses_count": 0,
        "following": false,
        "followed_by": false,
        "bio": "I am an optometrist in private practice, we call our business EYEWARES.. A husband and a father"
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/d34c89eb-53ec-403c-9f8e-14106d865c65.png",
        "display_name": "Iva",
        "acct": "Iva",
        "id": "0xdE32f08d3CE1Fdef7F474A2E63d5faa35E350fe4",
        "avatar_static": null,
        "created_at": "2020-05-15T08:10:30.450Z",
        "followers_count": 0,
        "follows_count": 0,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "Wisher",
        "remote": false,
        "statuses_count": 0,
        "following": false,
        "followed_by": false,
        "bio": "Follow the trend"
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/9e3f9a94-d738-4482-8b3b-d79e138979c4.png",
        "display_name": "Vlad Semenovs",
        "acct": "Vlad Semenovs",
        "id": "0xa0302924b7708829Ba6332249C1fA226A5656dAf",
        "avatar_static": null,
        "created_at": "2020-05-12T15:35:18.174Z",
        "followers_count": 0,
        "follows_count": 0,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "vlad",
        "remote": false,
        "statuses_count": 0,
        "following": false,
        "followed_by": false,
        "bio": null
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/894c4fb8-f2f1-482c-b913-75d27498697e.jpg",
        "display_name": "Anthony K.",
        "acct": "Anthony K.",
        "id": "0xc8b57E096d91ceA07349627180E1Ca484D100960",
        "avatar_static": null,
        "created_at": "2020-05-12T15:35:17.108Z",
        "followers_count": 0,
        "follows_count": 0,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "anthony",
        "remote": false,
        "statuses_count": 0,
        "following": false,
        "followed_by": false,
        "bio": null
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/971167d2-96af-4862-a6e6-db10a2abd627.png",
        "display_name": "The Biggest Paw",
        "acct": "The Biggest Paw",
        "id": "0x470A63C91D5F7CB4d3c9A70fDfAD5AEb6E33F495",
        "avatar_static": null,
        "created_at": "2020-05-12T15:37:30.688Z",
        "followers_count": 0,
        "follows_count": 0,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "balu",
        "remote": false,
        "statuses_count": 0,
        "following": false,
        "followed_by": false,
        "bio": null
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/1a9ce7fd-9e57-4e1f-8e3d-49bdbd252743.png",
        "display_name": "Prometeus Labs",
        "acct": "Prometeus Labs",
        "id": "0x2643DC5CB19b4e43C491f9D556263626a1791183",
        "avatar_static": null,
        "created_at": "2020-05-12T15:36:13.333Z",
        "followers_count": 0,
        "follows_count": 0,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "promlabs",
        "remote": false,
        "statuses_count": 0,
        "following": false,
        "followed_by": false,
        "bio": null
    },
    {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://178.128.240.29:3004/api/v1/media/e98d5696-bcf3-407e-adc4-32b781b1cf52.png",
        "display_name": "",
        "acct": "",
        "id": "0x4fd724C3Fea25207Dacc0abD07237070EEf87B36",
        "avatar_static": null,
        "created_at": "2020-05-23T09:25:59.294Z",
        "followers_count": 0,
        "follows_count": 0,
        "header": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://178.128.240.29:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "404error",
        "remote": false,
        "statuses_count": 0,
        "following": false,
        "followed_by": false,
        "bio": "From Russia with hate. News, that wouldn't show on Tv"
    }
]
````
