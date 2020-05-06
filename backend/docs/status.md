# Statuses API

## Table of contents

- [Create new status](#create-new-status)
- [Get status by ID](#get-status-by-id)
- [Get comments of status](#get-comments-of-status)
- [Like status](#like-status)
- [Unlike status](#unlike-status)

### Create new status

Creates new status. Requires access token to be present in headers.
Returns created status.

#### HTTP request

````
POST /api/v1/statuses
````

#### Request body parameters

| Parameter             | Type                  | Description                                                                                                                                                                                                 | Required                                                   |
|-----------------------|-----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------|
| status                | string                | Text of status                                                                                                                                                                                              |                                                            |
| media_attachments     | string[]              | IDs of attached files                                                                                                                                                                                       | Yes. If there are no attachments, empty array must be sent |
| referred_status_id    | string                | ID of referred status                                                                                                                                                                                       | No                                                         |
| status_reference_type | "REPOST" or "COMMENT" | Specifies how status with ID specified in referred_status_id field is referred. In case of "REPOST", the repost of status will be created. In case of "COMMENT", the comment to the status will be created. | Yes if referred_status_id is present                       |

#### Response 

Returns response of `Status` type

#### Sample request

`POST /api/v1/statuses`

````
{
    "status": "Test status",
    "media_attachments": [
        "f01b9cd5-3507-466e-b5b8-7c0de94c53af"
    ],
    "referred_status_id": "548c55dd-91a2-4719-bef5-d10fb94a1105",
    "status_reference_type": "COMMENT"
}
````

#### Sample response

````
{
    "media_attachments": [
        {
            "id": "f01b9cd5-3507-466e-b5b8-7c0de94c53af",
            "url": "http://localhost:3004/api/v1/media/f01b9cd5-3507-466e-b5b8-7c0de94c53af.jpg",
            "type": "image",
            "meta": {
                "width": 640,
                "height": 640
            }
        }
    ],
    "emojis": [],
    "tags": [],
    "fields": [],
    "visibility": "public",
    "spoiler_text": "",
    "revised_at": null,
    "referred_status": {
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
            "avatar": "http://localhost:3000/default_user.png",
            "display_name": "Lorenze Leforge",
            "acct": "Lorenze Leforge",
            "id": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
            "avatar_static": null,
            "created_at": "2020-05-01T11:54:55.239Z",
            "followers_count": 0,
            "follows_count": 0,
            "header": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
            "header_static": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
            "username": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
            "remote": false,
            "statuses_count": 41,
            "following": false,
            "followed_by": false
        },
        "created_at": "2020-05-04T10:59:26.676Z",
        "id": "548c55dd-91a2-4719-bef5-d10fb94a1105",
        "favourite_count": 1,
        "favourited": true,
        "content": "Hello world",
        "reposts_count": 0,
        "referred_status_id": "34614629-ffed-4198-babf-a679133d2161",
        "btfs_info": null,
        "comments_count": 1,
        "status_reference_type": "COMMENT",
        "referred_status_reference_type": "COMMENT"
    },
    "account": {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://localhost:3000/default_user.png",
        "display_name": "Lorenze Leforge",
        "acct": "Lorenze Leforge",
        "id": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
        "avatar_static": null,
        "created_at": "2020-05-01T11:54:55.239Z",
        "followers_count": 0,
        "follows_count": 0,
        "header": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
        "remote": false,
        "statuses_count": 41,
        "following": false,
        "followed_by": false
    },
    "created_at": "2020-05-05T06:30:24.402Z",
    "id": "c731b9f8-0cda-409e-a470-7f9443bd44f8",
    "favourite_count": 0,
    "favourited": false,
    "content": "Test status",
    "reposts_count": 0,
    "btfs_info": null,
    "comments_count": 0,
    "status_reference_type": "COMMENT"
}
````

### Get status by id

Returns status by its id

#### HTTP request

`GET /api/v1/statuses/{statusId}`

#### Request parameters

| Parameter | Type   | Description                  | Required |
|-----------|--------|------------------------------|----------|
| status_id | string | ID of status to be retrieved | yes      |

#### Response

Returns response of `Status` type.

#### Sample request

`GET /api/v1/statuses/34614629-ffed-4198-babf-a679133d2161`

#### Sample response

````
{
    "media_attachments": [],
    "tags": [],
    "fields": [],
    "visibility": "public",
    "spoiler_text": "",
    "revised_at": null,
    "referred_status": {
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
            "avatar": "http://localhost:3000/default_user.png",
            "display_name": "Lorenze Leforge",
            "acct": "Lorenze Leforge",
            "id": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
            "avatar_static": null,
            "created_at": "2020-05-01T11:54:55.239Z",
            "followers_count": 0,
            "follows_count": 0,
            "header": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
            "header_static": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
            "username": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
            "remote": false,
            "statuses_count": 39,
            "following": false,
            "followed_by": false
        },
        "created_at": "2020-05-04T04:05:33.938Z",
        "id": "2e273129-3ef8-437b-ae9b-bc35a251d600",
        "favourite_count": 1,
        "favourited": true,
        "content": "12345",
        "reposts_count": 0,
        "btfs_info": null,
        "comments_count": 11,
        "status_reference_type": null
    },
    "account": {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://localhost:3000/default_user.png",
        "display_name": "Lorenze Leforge",
        "acct": "Lorenze Leforge",
        "id": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
        "avatar_static": null,
        "created_at": "2020-05-01T11:54:55.239Z",
        "followers_count": 0,
        "follows_count": 0,
        "header": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
        "remote": false,
        "statuses_count": 39,
        "following": false,
        "followed_by": false
    },
    "created_at": "2020-05-04T06:04:31.378Z",
    "id": "34614629-ffed-4198-babf-a679133d2161",
    "favourite_count": 1,
    "favourited": true,
    "content": "test",
    "reposts_count": 1,
    "btfs_info": null,
    "comments_count": 1,
    "status_reference_type": "COMMENT"
}
````



### Get comments of status

Returns comments of status with the specified ID.

#### HTTP request

`GET /api/v1/statuses/{status_id}/comments?min_id&max_id

#### Request parameters

| Parameter | Type   | Description                  | Required |
|-----------|--------|------------------------------|----------|
| status_id | string | ID of status to be retrieved | yes      |

#### Query string parameters

| Parameter | Type   | Description                                      | Required |
|-----------|--------|--------------------------------------------------|----------|
| min_id    | string | ID of status from which retrieval should be done | no       |
| max_id    | string | ID of status to which retrieval should be done   | no       |

#### Response 

Response contains array of object of `Status` type

#### Sample request

`/api/v1/statuses/2e273129-3ef8-437b-ae9b-bc35a251d600/comments`

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
        "referred_status": {
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
                "avatar": "http://localhost:3000/default_user.png",
                "display_name": "Lorenze Leforge",
                "acct": "Lorenze Leforge",
                "id": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
                "avatar_static": null,
                "created_at": "2020-05-01T11:54:55.239Z",
                "followers_count": 0,
                "follows_count": 0,
                "header": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
                "header_static": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
                "username": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
                "remote": false,
                "statuses_count": 39,
                "following": false,
                "followed_by": false
            },
            "created_at": "2020-05-04T04:05:33.938Z",
            "id": "2e273129-3ef8-437b-ae9b-bc35a251d600",
            "favourite_count": 1,
            "favourited": true,
            "content": "12345",
            "reposts_count": 0,
            "btfs_info": null,
            "comments_count": 11,
            "status_reference_type": null
        },
        "account": {
            "emojis": [],
            "note": "",
            "fields": [],
            "avatar": "http://localhost:3000/default_user.png",
            "display_name": "Lorenze Leforge",
            "acct": "Lorenze Leforge",
            "id": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
            "avatar_static": null,
            "created_at": "2020-05-01T11:54:55.239Z",
            "followers_count": 0,
            "follows_count": 0,
            "header": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
            "header_static": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
            "username": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
            "remote": false,
            "statuses_count": 39,
            "following": false,
            "followed_by": false
        },
        "created_at": "2020-05-04T06:04:31.378Z",
        "id": "34614629-ffed-4198-babf-a679133d2161",
        "favourite_count": 1,
        "favourited": true,
        "content": "test",
        "reposts_count": 1,
        "btfs_info": null,
        "comments_count": 1,
        "status_reference_type": "COMMENT"
    },
    {
        "media_attachments": [],
        "emojis": [],
        "tags": [],
        "fields": [],
        "visibility": "public",
        "spoiler_text": "",
        "revised_at": null,
        "referred_status": {
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
                "avatar": "http://localhost:3000/default_user.png",
                "display_name": "Lorenze Leforge",
                "acct": "Lorenze Leforge",
                "id": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
                "avatar_static": null,
                "created_at": "2020-05-01T11:54:55.239Z",
                "followers_count": 0,
                "follows_count": 0,
                "header": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
                "header_static": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
                "username": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
                "remote": false,
                "statuses_count": 39,
                "following": false,
                "followed_by": false
            },
            "created_at": "2020-05-04T04:05:33.938Z",
            "id": "2e273129-3ef8-437b-ae9b-bc35a251d600",
            "favourite_count": 1,
            "favourited": true,
            "content": "12345",
            "reposts_count": 0,
            "btfs_info": null,
            "comments_count": 11,
            "status_reference_type": null
        },
        "account": {
            "emojis": [],
            "note": "",
            "fields": [],
            "avatar": "http://localhost:3000/default_user.png",
            "display_name": "Lorenze Leforge",
            "acct": "Lorenze Leforge",
            "id": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
            "avatar_static": null,
            "created_at": "2020-05-01T11:54:55.239Z",
            "followers_count": 0,
            "follows_count": 0,
            "header": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
            "header_static": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
            "username": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
            "remote": false,
            "statuses_count": 39,
            "following": false,
            "followed_by": false
        },
        "created_at": "2020-05-04T06:01:27.887Z",
        "id": "bc1ee03b-bb6e-48aa-a427-dd0af765796a",
        "favourite_count": 0,
        "favourited": false,
        "content": "test",
        "reposts_count": 0,
        "btfs_info": null,
        "comments_count": 0,
        "status_reference_type": "COMMENT"
    },
    {
        "media_attachments": [],
        "emojis": [],
        "tags": [],
        "fields": [],
        "visibility": "public",
        "spoiler_text": "",
        "revised_at": null,
        "referred_status": {
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
                "avatar": "http://localhost:3000/default_user.png",
                "display_name": "Lorenze Leforge",
                "acct": "Lorenze Leforge",
                "id": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
                "avatar_static": null,
                "created_at": "2020-05-01T11:54:55.239Z",
                "followers_count": 0,
                "follows_count": 0,
                "header": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
                "header_static": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
                "username": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
                "remote": false,
                "statuses_count": 39,
                "following": false,
                "followed_by": false
            },
            "created_at": "2020-05-04T04:05:33.938Z",
            "id": "2e273129-3ef8-437b-ae9b-bc35a251d600",
            "favourite_count": 1,
            "favourited": true,
            "content": "12345",
            "reposts_count": 0,
            "btfs_info": null,
            "comments_count": 11,
            "status_reference_type": null
        },
        "account": {
            "emojis": [],
            "note": "",
            "fields": [],
            "avatar": "http://localhost:3000/default_user.png",
            "display_name": "Lorenze Leforge",
            "acct": "Lorenze Leforge",
            "id": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
            "avatar_static": null,
            "created_at": "2020-05-01T11:54:55.239Z",
            "followers_count": 0,
            "follows_count": 0,
            "header": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
            "header_static": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
            "username": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
            "remote": false,
            "statuses_count": 39,
            "following": false,
            "followed_by": false
        },
        "created_at": "2020-05-04T05:59:45.629Z",
        "id": "266721f6-7e1c-48da-925c-189f8b020089",
        "favourite_count": 0,
        "favourited": false,
        "content": "test",
        "reposts_count": 1,
        "btfs_info": null,
        "comments_count": 0,
        "status_reference_type": "COMMENT"
    },
    {
        "media_attachments": [],
        "emojis": [],
        "tags": [],
        "fields": [],
        "visibility": "public",
        "spoiler_text": "",
        "revised_at": null,
        "referred_status": {
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
                "avatar": "http://localhost:3000/default_user.png",
                "display_name": "Lorenze Leforge",
                "acct": "Lorenze Leforge",
                "id": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
                "avatar_static": null,
                "created_at": "2020-05-01T11:54:55.239Z",
                "followers_count": 0,
                "follows_count": 0,
                "header": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
                "header_static": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
                "username": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
                "remote": false,
                "statuses_count": 39,
                "following": false,
                "followed_by": false
            },
            "created_at": "2020-05-04T04:05:33.938Z",
            "id": "2e273129-3ef8-437b-ae9b-bc35a251d600",
            "favourite_count": 1,
            "favourited": true,
            "content": "12345",
            "reposts_count": 0,
            "btfs_info": null,
            "comments_count": 11,
            "status_reference_type": null
        },
        "account": {
            "emojis": [],
            "note": "",
            "fields": [],
            "avatar": "http://localhost:3000/default_user.png",
            "display_name": "Lorenze Leforge",
            "acct": "Lorenze Leforge",
            "id": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
            "avatar_static": null,
            "created_at": "2020-05-01T11:54:55.239Z",
            "followers_count": 0,
            "follows_count": 0,
            "header": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
            "header_static": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
            "username": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
            "remote": false,
            "statuses_count": 39,
            "following": false,
            "followed_by": false
        },
        "created_at": "2020-05-04T05:59:08.509Z",
        "id": "963d91c9-1a15-4efc-b788-ca6a6f3979dc",
        "favourite_count": 0,
        "favourited": false,
        "content": "12345",
        "reposts_count": 0,
        "btfs_info": null,
        "comments_count": 0,
        "status_reference_type": "COMMENT"
    },
    {
        "media_attachments": [],
        "emojis": [],
        "tags": [],
        "fields": [],
        "visibility": "public",
        "spoiler_text": "",
        "revised_at": null,
        "referred_status": {
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
                "avatar": "http://localhost:3000/default_user.png",
                "display_name": "Lorenze Leforge",
                "acct": "Lorenze Leforge",
                "id": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
                "avatar_static": null,
                "created_at": "2020-05-01T11:54:55.239Z",
                "followers_count": 0,
                "follows_count": 0,
                "header": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
                "header_static": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
                "username": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
                "remote": false,
                "statuses_count": 39,
                "following": false,
                "followed_by": false
            },
            "created_at": "2020-05-04T04:05:33.938Z",
            "id": "2e273129-3ef8-437b-ae9b-bc35a251d600",
            "favourite_count": 1,
            "favourited": true,
            "content": "12345",
            "reposts_count": 0,
            "btfs_info": null,
            "comments_count": 11,
            "status_reference_type": null
        },
        "account": {
            "emojis": [],
            "note": "",
            "fields": [],
            "avatar": "http://localhost:3000/default_user.png",
            "display_name": "Lorenze Leforge",
            "acct": "Lorenze Leforge",
            "id": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
            "avatar_static": null,
            "created_at": "2020-05-01T11:54:55.239Z",
            "followers_count": 0,
            "follows_count": 0,
            "header": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
            "header_static": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
            "username": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
            "remote": false,
            "statuses_count": 39,
            "following": false,
            "followed_by": false
        },
        "created_at": "2020-05-04T05:53:51.104Z",
        "id": "f240014f-c741-41d1-9369-aa420d1df39b",
        "favourite_count": 0,
        "favourited": false,
        "content": "hello world",
        "reposts_count": 0,
        "btfs_info": null,
        "comments_count": 0,
        "status_reference_type": "COMMENT"
    },
    {
        "media_attachments": [],
        "emojis": [],
        "tags": [],
        "fields": [],
        "visibility": "public",
        "spoiler_text": "",
        "revised_at": null,
        "referred_status": {
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
                "avatar": "http://localhost:3000/default_user.png",
                "display_name": "Lorenze Leforge",
                "acct": "Lorenze Leforge",
                "id": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
                "avatar_static": null,
                "created_at": "2020-05-01T11:54:55.239Z",
                "followers_count": 0,
                "follows_count": 0,
                "header": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
                "header_static": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
                "username": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
                "remote": false,
                "statuses_count": 39,
                "following": false,
                "followed_by": false
            },
            "created_at": "2020-05-04T04:05:33.938Z",
            "id": "2e273129-3ef8-437b-ae9b-bc35a251d600",
            "favourite_count": 1,
            "favourited": true,
            "content": "12345",
            "reposts_count": 0,
            "btfs_info": null,
            "comments_count": 11,
            "status_reference_type": null
        },
        "account": {
            "emojis": [],
            "note": "",
            "fields": [],
            "avatar": "http://localhost:3000/default_user.png",
            "display_name": "Lorenze Leforge",
            "acct": "Lorenze Leforge",
            "id": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
            "avatar_static": null,
            "created_at": "2020-05-01T11:54:55.239Z",
            "followers_count": 0,
            "follows_count": 0,
            "header": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
            "header_static": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
            "username": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
            "remote": false,
            "statuses_count": 39,
            "following": false,
            "followed_by": false
        },
        "created_at": "2020-05-04T05:51:59.088Z",
        "id": "61b8e3dd-d94e-427e-b032-87d17f69cc26",
        "favourite_count": 0,
        "favourited": false,
        "content": "testing",
        "reposts_count": 0,
        "btfs_info": null,
        "comments_count": 0,
        "status_reference_type": "COMMENT"
    },
    {
        "media_attachments": [],
        "emojis": [],
        "tags": [],
        "fields": [],
        "visibility": "public",
        "spoiler_text": "",
        "revised_at": null,
        "referred_status": {
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
                "avatar": "http://localhost:3000/default_user.png",
                "display_name": "Lorenze Leforge",
                "acct": "Lorenze Leforge",
                "id": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
                "avatar_static": null,
                "created_at": "2020-05-01T11:54:55.239Z",
                "followers_count": 0,
                "follows_count": 0,
                "header": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
                "header_static": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
                "username": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
                "remote": false,
                "statuses_count": 39,
                "following": false,
                "followed_by": false
            },
            "created_at": "2020-05-04T04:05:33.938Z",
            "id": "2e273129-3ef8-437b-ae9b-bc35a251d600",
            "favourite_count": 1,
            "favourited": true,
            "content": "12345",
            "reposts_count": 0,
            "btfs_info": null,
            "comments_count": 11,
            "status_reference_type": null
        },
        "account": {
            "emojis": [],
            "note": "",
            "fields": [],
            "avatar": "http://localhost:3000/default_user.png",
            "display_name": "Lorenze Leforge",
            "acct": "Lorenze Leforge",
            "id": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
            "avatar_static": null,
            "created_at": "2020-05-01T11:54:55.239Z",
            "followers_count": 0,
            "follows_count": 0,
            "header": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
            "header_static": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
            "username": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
            "remote": false,
            "statuses_count": 39,
            "following": false,
            "followed_by": false
        },
        "created_at": "2020-05-04T05:49:10.038Z",
        "id": "0f30929e-6e11-4810-98ed-bcd6ac80f33c",
        "favourite_count": 0,
        "favourited": false,
        "content": "test",
        "reposts_count": 0,
        "btfs_info": null,
        "comments_count": 0,
        "status_reference_type": "COMMENT"
    },
    {
        "media_attachments": [],
        "emojis": [],
        "tags": [],
        "fields": [],
        "visibility": "public",
        "spoiler_text": "",
        "revised_at": null,
        "referred_status": {
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
                "avatar": "http://localhost:3000/default_user.png",
                "display_name": "Lorenze Leforge",
                "acct": "Lorenze Leforge",
                "id": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
                "avatar_static": null,
                "created_at": "2020-05-01T11:54:55.239Z",
                "followers_count": 0,
                "follows_count": 0,
                "header": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
                "header_static": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
                "username": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
                "remote": false,
                "statuses_count": 39,
                "following": false,
                "followed_by": false
            },
            "created_at": "2020-05-04T04:05:33.938Z",
            "id": "2e273129-3ef8-437b-ae9b-bc35a251d600",
            "favourite_count": 1,
            "favourited": true,
            "content": "12345",
            "reposts_count": 0,
            "btfs_info": null,
            "comments_count": 11,
            "status_reference_type": null
        },
        "account": {
            "emojis": [],
            "note": "",
            "fields": [],
            "avatar": "http://localhost:3000/default_user.png",
            "display_name": "Lorenze Leforge",
            "acct": "Lorenze Leforge",
            "id": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
            "avatar_static": null,
            "created_at": "2020-05-01T11:54:55.239Z",
            "followers_count": 0,
            "follows_count": 0,
            "header": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
            "header_static": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
            "username": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
            "remote": false,
            "statuses_count": 39,
            "following": false,
            "followed_by": false
        },
        "created_at": "2020-05-04T05:48:48.332Z",
        "id": "0aadfadf-f843-4be1-91a9-4429960f62e2",
        "favourite_count": 0,
        "favourited": false,
        "content": "test",
        "reposts_count": 0,
        "btfs_info": null,
        "comments_count": 0,
        "status_reference_type": "COMMENT"
    },
    {
        "media_attachments": [],
        "emojis": [],
        "tags": [],
        "fields": [],
        "visibility": "public",
        "spoiler_text": "",
        "revised_at": null,
        "referred_status": {
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
                "avatar": "http://localhost:3000/default_user.png",
                "display_name": "Lorenze Leforge",
                "acct": "Lorenze Leforge",
                "id": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
                "avatar_static": null,
                "created_at": "2020-05-01T11:54:55.239Z",
                "followers_count": 0,
                "follows_count": 0,
                "header": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
                "header_static": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
                "username": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
                "remote": false,
                "statuses_count": 39,
                "following": false,
                "followed_by": false
            },
            "created_at": "2020-05-04T04:05:33.938Z",
            "id": "2e273129-3ef8-437b-ae9b-bc35a251d600",
            "favourite_count": 1,
            "favourited": true,
            "content": "12345",
            "reposts_count": 0,
            "btfs_info": null,
            "comments_count": 11,
            "status_reference_type": null
        },
        "account": {
            "emojis": [],
            "note": "",
            "fields": [],
            "avatar": "http://localhost:3000/default_user.png",
            "display_name": "Lorenze Leforge",
            "acct": "Lorenze Leforge",
            "id": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
            "avatar_static": null,
            "created_at": "2020-05-01T11:54:55.239Z",
            "followers_count": 0,
            "follows_count": 0,
            "header": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
            "header_static": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
            "username": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
            "remote": false,
            "statuses_count": 39,
            "following": false,
            "followed_by": false
        },
        "created_at": "2020-05-04T05:22:34.566Z",
        "id": "c052f28a-843e-4607-ae7a-47cc32fcebf0",
        "favourite_count": 1,
        "favourited": true,
        "content": "test",
        "reposts_count": 4,
        "btfs_info": null,
        "comments_count": 0,
        "status_reference_type": "COMMENT"
    },
    {
        "media_attachments": [],
        "emojis": [],
        "tags": [],
        "fields": [],
        "visibility": "public",
        "spoiler_text": "",
        "revised_at": null,
        "referred_status": {
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
                "avatar": "http://localhost:3000/default_user.png",
                "display_name": "Lorenze Leforge",
                "acct": "Lorenze Leforge",
                "id": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
                "avatar_static": null,
                "created_at": "2020-05-01T11:54:55.239Z",
                "followers_count": 0,
                "follows_count": 0,
                "header": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
                "header_static": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
                "username": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
                "remote": false,
                "statuses_count": 39,
                "following": false,
                "followed_by": false
            },
            "created_at": "2020-05-04T04:05:33.938Z",
            "id": "2e273129-3ef8-437b-ae9b-bc35a251d600",
            "favourite_count": 1,
            "favourited": true,
            "content": "12345",
            "reposts_count": 0,
            "btfs_info": null,
            "comments_count": 11,
            "status_reference_type": null
        },
        "account": {
            "emojis": [],
            "note": "",
            "fields": [],
            "avatar": "http://localhost:3000/default_user.png",
            "display_name": "Lorenze Leforge",
            "acct": "Lorenze Leforge",
            "id": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
            "avatar_static": null,
            "created_at": "2020-05-01T11:54:55.239Z",
            "followers_count": 0,
            "follows_count": 0,
            "header": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
            "header_static": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
            "username": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
            "remote": false,
            "statuses_count": 39,
            "following": false,
            "followed_by": false
        },
        "created_at": "2020-05-04T05:13:30.226Z",
        "id": "3446ba40-30e8-4815-9d2e-3f7a04b4610b",
        "favourite_count": 0,
        "favourited": false,
        "content": "hello world",
        "reposts_count": 0,
        "btfs_info": null,
        "comments_count": 0,
        "status_reference_type": "COMMENT"
    },
    {
        "media_attachments": [],
        "emojis": [],
        "tags": [],
        "fields": [],
        "visibility": "public",
        "spoiler_text": "",
        "revised_at": null,
        "referred_status": {
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
                "avatar": "http://localhost:3000/default_user.png",
                "display_name": "Lorenze Leforge",
                "acct": "Lorenze Leforge",
                "id": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
                "avatar_static": null,
                "created_at": "2020-05-01T11:54:55.239Z",
                "followers_count": 0,
                "follows_count": 0,
                "header": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
                "header_static": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
                "username": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
                "remote": false,
                "statuses_count": 39,
                "following": false,
                "followed_by": false
            },
            "created_at": "2020-05-04T04:05:33.938Z",
            "id": "2e273129-3ef8-437b-ae9b-bc35a251d600",
            "favourite_count": 1,
            "favourited": true,
            "content": "12345",
            "reposts_count": 0,
            "btfs_info": null,
            "comments_count": 11,
            "status_reference_type": null
        },
        "account": {
            "emojis": [],
            "note": "",
            "fields": [],
            "avatar": "http://localhost:3000/default_user.png",
            "display_name": "Lorenze Leforge",
            "acct": "Lorenze Leforge",
            "id": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
            "avatar_static": null,
            "created_at": "2020-05-01T11:54:55.239Z",
            "followers_count": 0,
            "follows_count": 0,
            "header": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
            "header_static": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
            "username": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
            "remote": false,
            "statuses_count": 39,
            "following": false,
            "followed_by": false
        },
        "created_at": "2020-05-04T04:16:56.403Z",
        "id": "c6e50ba0-0179-4d43-a5d9-074f54bafffa",
        "favourite_count": 0,
        "favourited": false,
        "content": "test",
        "reposts_count": 1,
        "btfs_info": null,
        "comments_count": 0,
        "status_reference_type": "COMMENT"
    }
]
````

### Like status

#### HTTP request

`POST /api/v1/statuses/{status_id}/favourite`

#### Request parameters

| Parameter | Type   | Description              | Required |
|-----------|--------|--------------------------|----------|
| status_id | string | ID of status to be liked | yes      |

#### Response

Returns response of `Status` type. In contains status which has been liked.

#### Sample request

`POST /api/v1/statuses/c731b9f8-0cda-409e-a470-7f9443bd44f8/favourite`

#### Sample response

````
{
    "media_attachments": [
        {
            "id": "f01b9cd5-3507-466e-b5b8-7c0de94c53af",
            "url": "http://localhost:3004/api/v1/media/f01b9cd5-3507-466e-b5b8-7c0de94c53af.jpg",
            "type": "image",
            "meta": {
                "width": 640,
                "height": 640
            }
        }
    ],
    "emojis": [],
    "tags": [],
    "fields": [],
    "visibility": "public",
    "spoiler_text": "",
    "revised_at": null,
    "referred_status": {
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
            "avatar": "http://localhost:3000/default_user.png",
            "display_name": "Lorenze Leforge",
            "acct": "Lorenze Leforge",
            "id": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
            "avatar_static": null,
            "created_at": "2020-05-01T11:54:55.239Z",
            "followers_count": 0,
            "follows_count": 0,
            "header": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
            "header_static": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
            "username": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
            "remote": false,
            "statuses_count": 41,
            "following": false,
            "followed_by": false
        },
        "created_at": "2020-05-04T10:59:26.676Z",
        "id": "548c55dd-91a2-4719-bef5-d10fb94a1105",
        "favourite_count": 1,
        "favourited": true,
        "content": "Hello world",
        "reposts_count": 0,
        "referred_status_id": "34614629-ffed-4198-babf-a679133d2161",
        "btfs_info": null,
        "comments_count": 1,
        "status_reference_type": "COMMENT",
        "referred_status_reference_type": "COMMENT"
    },
    "account": {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://localhost:3000/default_user.png",
        "display_name": "Lorenze Leforge",
        "acct": "Lorenze Leforge",
        "id": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
        "avatar_static": null,
        "created_at": "2020-05-01T11:54:55.239Z",
        "followers_count": 0,
        "follows_count": 0,
        "header": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
        "remote": false,
        "statuses_count": 41,
        "following": false,
        "followed_by": false
    },
    "created_at": "2020-05-05T06:30:24.402Z",
    "id": "c731b9f8-0cda-409e-a470-7f9443bd44f8",
    "favourite_count": 1,
    "favourited": true,
    "content": "Test status",
    "reposts_count": 0,
    "btfs_info": null,
    "comments_count": 0,
    "status_reference_type": "COMMENT"
}
````


### Unlike status

#### HTTP request

`DELETE /api/v1/statuses/{status_id}/unfavourite`

#### Request parameters

| Parameter | Type   | Description                | Required |
|-----------|--------|----------------------------|----------|
| status_id | string | ID of status to be unliked | yes      |

#### Response

Response contains object of `Status` type. It is status which has been unliked.

#### Sample request

`DELETE /api/v1/statuses/c731b9f8-0cda-409e-a470-7f9443bd44f8/unfavourite`

#### Sample response

````
{
    "media_attachments": [
        {
            "id": "f01b9cd5-3507-466e-b5b8-7c0de94c53af",
            "url": "http://localhost:3004/api/v1/media/f01b9cd5-3507-466e-b5b8-7c0de94c53af.jpg",
            "type": "image",
            "meta": {
                "width": 640,
                "height": 640
            }
        }
    ],
    "emojis": [],
    "tags": [],
    "fields": [],
    "visibility": "public",
    "spoiler_text": "",
    "revised_at": null,
    "referred_status": {
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
            "avatar": "http://localhost:3000/default_user.png",
            "display_name": "Lorenze Leforge",
            "acct": "Lorenze Leforge",
            "id": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
            "avatar_static": null,
            "created_at": "2020-05-01T11:54:55.239Z",
            "followers_count": 0,
            "follows_count": 0,
            "header": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
            "header_static": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
            "username": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
            "remote": false,
            "statuses_count": 41,
            "following": false,
            "followed_by": false
        },
        "created_at": "2020-05-04T10:59:26.676Z",
        "id": "548c55dd-91a2-4719-bef5-d10fb94a1105",
        "favourite_count": 1,
        "favourited": true,
        "content": "Hello world",
        "reposts_count": 0,
        "referred_status_id": "34614629-ffed-4198-babf-a679133d2161",
        "btfs_info": null,
        "comments_count": 1,
        "status_reference_type": "COMMENT",
        "referred_status_reference_type": "COMMENT"
    },
    "account": {
        "emojis": [],
        "note": "",
        "fields": [],
        "avatar": "http://localhost:3000/default_user.png",
        "display_name": "Lorenze Leforge",
        "acct": "Lorenze Leforge",
        "id": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
        "avatar_static": null,
        "created_at": "2020-05-01T11:54:55.239Z",
        "followers_count": 0,
        "follows_count": 0,
        "header": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "header_static": "http://localhost:3004/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png",
        "username": "0x4EEA0A7D078b499C2AB937650f7033f2d70E3427",
        "remote": false,
        "statuses_count": 41,
        "following": false,
        "followed_by": false
    },
    "created_at": "2020-05-05T06:30:24.402Z",
    "id": "c731b9f8-0cda-409e-a470-7f9443bd44f8",
    "favourite_count": 0,
    "favourited": false,
    "content": "Test status",
    "reposts_count": 0,
    "btfs_info": null,
    "comments_count": 0,
    "status_reference_type": "COMMENT"
}
````
