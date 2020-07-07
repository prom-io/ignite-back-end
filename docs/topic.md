# Topics API

## Table of contents

- [Get list of topics](#get-list-of-topics)
- [Get topic by title and language](#get-topic-by-title-and-language)
- [Get statuses by topic](#get-statuses-by-topic)
- [Get statuses which have hash tags](#get-statuses-which-have-hash-tags)
- [Follow hash tag](#follow-hash-tag)
- [Unfollow hash tag](#unfollow-hash-tag)

### Get list of topics

Returns list of topics sorted by number of statuses.

#### HTTP request

````
GET /api/v1/topics?count={count}
````

#### Request parameters

| Parameter | Type   | Description                                          | Required |
|-----------|--------|------------------------------------------------------|----------|
| count     | number | How many topics will be returned. Default value is 5 | no       |

#### Response

Response contains array of [Topic](https://github.com/Prometeus-Network/ignite-back-end/blob/feature/hashtags/docs/api-entities.md#topic) type.

#### Sample request

````
GET /api/v1/topics?count=5
````

#### Sample response

````
[
    {
        "id": "da3d9f87-1fa1-4177-ab87-83965bae2aca",
        "following": false,
        "language": "en",
        "posts_count": 3,
        "title": "HashTags"
    },
    {
        "id": "8bffe5e9-2ec9-4c58-879f-2574347576d6",
        "following": false,
        "language": "en",
        "posts_count": 2,
        "title": "World"
    },
    {
        "id": "22acd0fa-8590-4309-b58d-a7da2a83edca",
        "following": false,
        "language": "en",
        "posts_count": 2,
        "title": "awesome"
    },
    {
        "id": "82477284-443b-4fad-9686-9030e37032b9",
        "following": false,
        "language": "en",
        "posts_count": 1,
        "title": "Testing"
    },
    {
        "id": "caa5438b-1941-4265-8f84-3eff2c98d858",
        "following": false,
        "language": "en",
        "posts_count": 1,
        "title": "Hello"
    }
]
````

### Get topic by title and language

Returns topic by title and language.

#### HTTP request

````
GET /api/v1/topics/{title}?language={language}
````

#### Request parameters

| Parameter | Type                    | Description                                                                          | Required |
|-----------|------------------------|--------------------------------------------------------------------------------------|----------|
| title     | string                 | Title of the topic                                                                   | yes      |
| language  | enum("en", "ko", "kr") | Language of the topic. If no language is passed, then "EN" will be used as default.  | no       |

#### Response type

Returns object of [Topic](https://github.com/Prometeus-Network/ignite-back-end/blob/feature/hashtags/docs/api-entities.md#topic) type.

#### Sample request

````
GET /api/v1/topics/Testing?language=en
````

#### Sample response

````
{
    "id": "82477284-443b-4fad-9686-9030e37032b9",
    "following": false,
    "language": "en",
    "posts_count": 1,
    "title": "Testing"
}
````

### Get statuses by topic

Returns statuses of the specified topic

#### HTTP request

````
/api/v1/topics/{title}/statuses?laguage={language}&type={type}&since_id={since_id}&max_id={max_id}
````

#### Request parameters

| Parameter | Type                    | Description                                                                                                                                                                                                                                                            | Required |
|-----------|-------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| title     | string                  | Title of the topic                                                                                                                                                                                                                                                     | yes      |
| language  | enum("en", "ko", "kr")  | Language of the topic. If no language is passed, then "en" will be used as default.                                                                                                                                                                                    | no       |
| type      | enum("hot", "fresh")    | Determines how statuses will be sorted. If type is "fresh" then statuses will be sorted descendingly by their creation date. It type is "hot", then statuses will be sorted descendingly by number of likes they have received for last 7 days. Default value is "hot" | no       |
| since_id  | string                  | ID of status with minimal creation date                                                                                                                                                                                                                                | no       |
| max_id    | string                  | ID of status with max creation date                                                                                                                                                                                                                                    | no       |

#### Response type

Returns array of [Status](https://github.com/Prometeus-Network/ignite-back-end/blob/feature/hashtags/docs/api-entities.md#status) type

#### Sample request

````
GET /api/v1/topics/HashTags/statuses?type=hot
````

#### Sample response

````
[
    {
        "media_attachments": [],
        "emojis": [],
        "tags": [],
        "fields": [],
        "visibility": "public",
        "spoiler_text": "",
        "revised_at": null,
        "referred_status": null,
        "account": {
            "emojis": [],
            "note": "",
            "fields": [],
            "avatar": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "display_name": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
            "acct": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
            "id": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
            "avatar_static": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "created_at": "2020-02-24T14:38:05.523Z",
            "followers_count": 2,
            "follows_count": 9,
            "header": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "header_static": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "username": "Kehlani",
            "remote": false,
            "statuses_count": 52,
            "following": false,
            "followed_by": false,
            "bio": null
        },
        "created_at": "2020-06-29T05:40:55.668Z",
        "id": "4a368cd2-1ab6-4e33-af12-eb4979c04a4f",
        "favourite_count": 1,
        "favourited": false,
        "content": "#Testing #HashTags",
        "reposts_count": 0,
        "btfs_info": null,
        "comments_count": 0,
        "status_reference_type": null,
        "can_be_reposted": true,
        "hash_tags": [
            {
                "id": "82477284-443b-4fad-9686-9030e37032b9",
                "following": false,
                "language": "en",
                "posts_count": 1,
                "title": "Testing"
            },
            {
                "id": "da3d9f87-1fa1-4177-ab87-83965bae2aca",
                "following": false,
                "language": "en",
                "posts_count": 3,
                "title": "HashTags"
            }
        ]
    },
    {
        "media_attachments": [],
        "emojis": [],
        "tags": [],
        "fields": [],
        "visibility": "public",
        "spoiler_text": "",
        "revised_at": null,
        "referred_status": null,
        "account": {
            "emojis": [],
            "note": "",
            "fields": [],
            "avatar": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "display_name": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
            "acct": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
            "id": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
            "avatar_static": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "created_at": "2020-02-24T14:38:05.523Z",
            "followers_count": 2,
            "follows_count": 9,
            "header": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "header_static": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "username": "Kehlani",
            "remote": false,
            "statuses_count": 52,
            "following": false,
            "followed_by": false,
            "bio": null
        },
        "created_at": "2020-06-29T06:24:48.929Z",
        "id": "d46cff49-29a8-42d3-a0ca-eb4f0be37635",
        "favourite_count": 0,
        "favourited": false,
        "content": "#HashTags are #awesome",
        "reposts_count": 0,
        "btfs_info": null,
        "comments_count": 0,
        "status_reference_type": null,
        "can_be_reposted": true,
        "hash_tags": [
            {
                "id": "da3d9f87-1fa1-4177-ab87-83965bae2aca",
                "following": false,
                "language": "en",
                "posts_count": 3,
                "title": "HashTags"
            },
            {
                "id": "22acd0fa-8590-4309-b58d-a7da2a83edca",
                "following": false,
                "language": "en",
                "posts_count": 2,
                "title": "awesome"
            }
        ]
    },
    {
        "media_attachments": [],
        "emojis": [],
        "tags": [],
        "fields": [],
        "visibility": "public",
        "spoiler_text": "",
        "revised_at": null,
        "referred_status": null,
        "account": {
            "emojis": [],
            "note": "",
            "fields": [],
            "avatar": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "display_name": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
            "acct": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
            "id": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
            "avatar_static": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "created_at": "2020-02-24T14:38:05.523Z",
            "followers_count": 2,
            "follows_count": 9,
            "header": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "header_static": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "username": "Kehlani",
            "remote": false,
            "statuses_count": 52,
            "following": false,
            "followed_by": false,
            "bio": null
        },
        "created_at": "2020-06-29T06:14:18.216Z",
        "id": "d5abe1fb-ea0e-41f9-9f64-c5233f3b8ac6",
        "favourite_count": 0,
        "favourited": false,
        "content": "#HashTags",
        "reposts_count": 0,
        "btfs_info": null,
        "comments_count": 0,
        "status_reference_type": null,
        "can_be_reposted": true,
        "hash_tags": [
            {
                "id": "da3d9f87-1fa1-4177-ab87-83965bae2aca",
                "following": false,
                "language": "en",
                "posts_count": 3,
                "title": "HashTags"
            }
        ]
    }
]
````

### Get statuses which have hash tags

Returns statuses which have hash tags

#### HTTP request

````
/api/v1/statuses/statuses?only_with_hash_tags={true}&type={type}
````

#### Request parameters

| Parameter           | Type                    | Description                                                                                                                                                                                                                                                            | Required |
|---------------------|-------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| only_with_hash_tags | boolean                 | If true than only statuses with hash tags will be returned                                                                                                                                                                                                             | no       |
| language            | enum("en", "ko", "kr")  | Language of the topic. Default value is "en"                                                                                                                                                                                                                           | no       |
| type                | enum("hot", "fresh")    | Determines how statuses will be sorted. If type is "fresh" then statuses will be sorted descendingly by their creation date. It type is "hot", then statuses will be sorted descendingly by number of likes they have received for last 7 days. Default value is "hot" | no       |
| since_id            | string                  | ID of status with minimal creation date                                                                                                                                                                                                                                | no       |
| max_id              | string                  | ID of status with max creation date                                                                                                                                                                                                                                    | no       |

If `only_with_hash_tags` parameter is not passed or not specified, then the content of `/api/v1/timelines/global` will be returned and `type` and `language` parameters will be ignored

#### Response type

Returns array of [Status](https://github.com/Prometeus-Network/ignite-back-end/blob/feature/hashtags/docs/api-entities.md#status) type

#### Sample request

````
GET /api/v1/statuses?only_with_hash_tags=true&type=hot
````

#### Sample response

````
[
    {
        "media_attachments": [],
        "emojis": [],
        "tags": [],
        "fields": [],
        "visibility": "public",
        "spoiler_text": "",
        "revised_at": null,
        "referred_status": null,
        "account": {
            "emojis": [],
            "note": "",
            "fields": [],
            "avatar": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "display_name": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
            "acct": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
            "id": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
            "avatar_static": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "created_at": "2020-02-24T14:38:05.523Z",
            "followers_count": 2,
            "follows_count": 9,
            "header": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "header_static": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "username": "Kehlani",
            "remote": false,
            "statuses_count": 52,
            "following": false,
            "followed_by": false,
            "bio": null
        },
        "created_at": "2020-06-29T05:40:55.668Z",
        "id": "4a368cd2-1ab6-4e33-af12-eb4979c04a4f",
        "favourite_count": 1,
        "favourited": false,
        "content": "#Testing #HashTags",
        "reposts_count": 0,
        "btfs_info": null,
        "comments_count": 0,
        "status_reference_type": null,
        "can_be_reposted": true,
        "hash_tags": [
            {
                "id": "82477284-443b-4fad-9686-9030e37032b9",
                "following": false,
                "language": "en",
                "posts_count": 1,
                "title": "Testing"
            },
            {
                "id": "da3d9f87-1fa1-4177-ab87-83965bae2aca",
                "following": false,
                "language": "en",
                "posts_count": 3,
                "title": "HashTags"
            }
        ]
    },
    {
        "media_attachments": [],
        "emojis": [],
        "tags": [],
        "fields": [],
        "visibility": "public",
        "spoiler_text": "",
        "revised_at": null,
        "referred_status": null,
        "account": {
            "emojis": [],
            "note": "",
            "fields": [],
            "avatar": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "display_name": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
            "acct": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
            "id": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
            "avatar_static": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "created_at": "2020-02-24T14:38:05.523Z",
            "followers_count": 2,
            "follows_count": 9,
            "header": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "header_static": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "username": "Kehlani",
            "remote": false,
            "statuses_count": 52,
            "following": false,
            "followed_by": false,
            "bio": null
        },
        "created_at": "2020-06-29T06:28:21.776Z",
        "id": "9e37f6cb-ad5a-4b8f-a350-c99ac75f96e8",
        "favourite_count": 0,
        "favourited": false,
        "content": "Test #awesome",
        "reposts_count": 0,
        "btfs_info": null,
        "comments_count": 0,
        "status_reference_type": null,
        "can_be_reposted": true,
        "hash_tags": [
            {
                "id": "22acd0fa-8590-4309-b58d-a7da2a83edca",
                "following": false,
                "language": "en",
                "posts_count": 2,
                "title": "awesome"
            }
        ]
    },
    {
        "media_attachments": [],
        "emojis": [],
        "tags": [],
        "fields": [],
        "visibility": "public",
        "spoiler_text": "",
        "revised_at": null,
        "referred_status": null,
        "account": {
            "emojis": [],
            "note": "",
            "fields": [],
            "avatar": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "display_name": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
            "acct": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
            "id": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
            "avatar_static": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "created_at": "2020-02-24T14:38:05.523Z",
            "followers_count": 2,
            "follows_count": 9,
            "header": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "header_static": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "username": "Kehlani",
            "remote": false,
            "statuses_count": 52,
            "following": false,
            "followed_by": false,
            "bio": null
        },
        "created_at": "2020-06-29T06:26:37.739Z",
        "id": "0e58b4fd-23fc-401d-a63d-de4f448ffe82",
        "favourite_count": 0,
        "favourited": false,
        "content": "Test #World",
        "reposts_count": 0,
        "btfs_info": null,
        "comments_count": 0,
        "status_reference_type": null,
        "can_be_reposted": true,
        "hash_tags": [
            {
                "id": "8bffe5e9-2ec9-4c58-879f-2574347576d6",
                "following": false,
                "language": "en",
                "posts_count": 2,
                "title": "World"
            }
        ]
    },
    {
        "media_attachments": [],
        "emojis": [],
        "tags": [],
        "fields": [],
        "visibility": "public",
        "spoiler_text": "",
        "revised_at": null,
        "referred_status": null,
        "account": {
            "emojis": [],
            "note": "",
            "fields": [],
            "avatar": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "display_name": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
            "acct": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
            "id": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
            "avatar_static": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "created_at": "2020-02-24T14:38:05.523Z",
            "followers_count": 2,
            "follows_count": 9,
            "header": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "header_static": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "username": "Kehlani",
            "remote": false,
            "statuses_count": 52,
            "following": false,
            "followed_by": false,
            "bio": null
        },
        "created_at": "2020-06-29T06:25:50.337Z",
        "id": "563fcbf7-c01d-4ddb-9162-7af2a3a5cdd0",
        "favourite_count": 0,
        "favourited": false,
        "content": "Test #Wolrd",
        "reposts_count": 0,
        "btfs_info": null,
        "comments_count": 0,
        "status_reference_type": null,
        "can_be_reposted": true,
        "hash_tags": [
            {
                "id": "9d8d1f68-9de9-4bba-a93b-22d26369a3f2",
                "following": false,
                "language": "en",
                "posts_count": 1,
                "title": "Wolrd"
            }
        ]
    },
    {
        "media_attachments": [],
        "emojis": [],
        "tags": [],
        "fields": [],
        "visibility": "public",
        "spoiler_text": "",
        "revised_at": null,
        "referred_status": null,
        "account": {
            "emojis": [],
            "note": "",
            "fields": [],
            "avatar": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "display_name": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
            "acct": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
            "id": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
            "avatar_static": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "created_at": "2020-02-24T14:38:05.523Z",
            "followers_count": 2,
            "follows_count": 9,
            "header": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "header_static": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "username": "Kehlani",
            "remote": false,
            "statuses_count": 52,
            "following": false,
            "followed_by": false,
            "bio": null
        },
        "created_at": "2020-06-29T06:24:48.929Z",
        "id": "d46cff49-29a8-42d3-a0ca-eb4f0be37635",
        "favourite_count": 0,
        "favourited": false,
        "content": "#HashTags are #awesome",
        "reposts_count": 0,
        "btfs_info": null,
        "comments_count": 0,
        "status_reference_type": null,
        "can_be_reposted": true,
        "hash_tags": [
            {
                "id": "22acd0fa-8590-4309-b58d-a7da2a83edca",
                "following": false,
                "language": "en",
                "posts_count": 2,
                "title": "awesome"
            },
            {
                "id": "da3d9f87-1fa1-4177-ab87-83965bae2aca",
                "following": false,
                "language": "en",
                "posts_count": 3,
                "title": "HashTags"
            }
        ]
    },
    {
        "media_attachments": [],
        "emojis": [],
        "tags": [],
        "fields": [],
        "visibility": "public",
        "spoiler_text": "",
        "revised_at": null,
        "referred_status": null,
        "account": {
            "emojis": [],
            "note": "",
            "fields": [],
            "avatar": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "display_name": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
            "acct": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
            "id": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
            "avatar_static": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "created_at": "2020-02-24T14:38:05.523Z",
            "followers_count": 2,
            "follows_count": 9,
            "header": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "header_static": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "username": "Kehlani",
            "remote": false,
            "statuses_count": 52,
            "following": false,
            "followed_by": false,
            "bio": null
        },
        "created_at": "2020-06-29T06:24:36.914Z",
        "id": "885837ff-60e6-4a38-8a1a-123ceea935d6",
        "favourite_count": 0,
        "favourited": false,
        "content": "#Hello #World",
        "reposts_count": 0,
        "btfs_info": null,
        "comments_count": 0,
        "status_reference_type": null,
        "can_be_reposted": true,
        "hash_tags": [
            {
                "id": "caa5438b-1941-4265-8f84-3eff2c98d858",
                "following": false,
                "language": "en",
                "posts_count": 1,
                "title": "Hello"
            },
            {
                "id": "8bffe5e9-2ec9-4c58-879f-2574347576d6",
                "following": false,
                "language": "en",
                "posts_count": 2,
                "title": "World"
            }
        ]
    },
    {
        "media_attachments": [],
        "emojis": [],
        "tags": [],
        "fields": [],
        "visibility": "public",
        "spoiler_text": "",
        "revised_at": null,
        "referred_status": null,
        "account": {
            "emojis": [],
            "note": "",
            "fields": [],
            "avatar": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "display_name": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
            "acct": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
            "id": "0xF8eAFFA58C155a54951aF9afCc0159e98ec5421d",
            "avatar_static": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "created_at": "2020-02-24T14:38:05.523Z",
            "followers_count": 2,
            "follows_count": 9,
            "header": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "header_static": "http://178.128.240.29:3004/api/v1/media/4749995b-78f4-434a-bed2-f4cf6869f933.jpg",
            "username": "Kehlani",
            "remote": false,
            "statuses_count": 52,
            "following": false,
            "followed_by": false,
            "bio": null
        },
        "created_at": "2020-06-29T06:14:18.216Z",
        "id": "d5abe1fb-ea0e-41f9-9f64-c5233f3b8ac6",
        "favourite_count": 0,
        "favourited": false,
        "content": "#HashTags",
        "reposts_count": 0,
        "btfs_info": null,
        "comments_count": 0,
        "status_reference_type": null,
        "can_be_reposted": true,
        "hash_tags": [
            {
                "id": "da3d9f87-1fa1-4177-ab87-83965bae2aca",
                "following": false,
                "language": "en",
                "posts_count": 3,
                "title": "HashTags"
            }
        ]
    }
]
````

### Follow hash tag

Subscribes current user to the hash tag with the specified id

#### HTTP request

````
POST /api/v1/topics/:id/follow
````

#### Request parameters

| Parameter           | Type                    | Description                   | Required |
|---------------------|-------------------------|-------------------------------|----------|
| id                  | string                  | ID of hash tag to subscribe   | yes      |

#### Response type

Returns object of [Topic](https://github.com/Prometeus-Network/ignite-back-end/blob/feature/hashtags/docs/api-entities.md#topic) type

#### Sample request

````
POST /api/v1/topics/537a429b-8928-45f1-b0ca-165e9ecebf72/follow
````

#### Sample response

````
{
    "id": "537a429b-8928-45f1-b0ca-165e9ecebf72",
    "following": true,
    "language": "en",
    "posts_count": 30,
    "title": "funny"
}
````

### Unfollow hash tag

Unsubscribes current user from the hash tag with the specified id

#### HTTP request

````
DELETE /api/v1/topics/:id/follow
````

#### Request parameters

| Parameter           | Type                    | Description                     | Required |
|---------------------|-------------------------|---------------------------------|----------|
| id                  | string                  | ID of hash tag to unsubscribe   | yes      |

#### Response type

Returns object of [Topic](https://github.com/Prometeus-Network/ignite-back-end/blob/feature/hashtags/docs/api-entities.md#topic) type

#### Sample request

````
DELETE /api/v1/topics/537a429b-8928-45f1-b0ca-165e9ecebf72/unfollow
````

#### Sample response

````
{
    "id": "537a429b-8928-45f1-b0ca-165e9ecebf72",
    "following": false,
    "language": "en",
    "posts_count": 30,
    "title": "funny"
}
````
